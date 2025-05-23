import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text } from 'react-native-svg';

// Type definitions for GeoJSON
interface GeoJSONFeature {
  type: "Feature";
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Airport coordinates and city names
const airports: { [key: string]: { coords: [number, number]; city: string } } = {
  'ORD': { coords: [41.9786, -87.9048], city: 'Chicago' }, // O'Hare
  'LGA': { coords: [40.7769, -73.8740], city: 'New York' }, // LaGuardia
  'LAX': { coords: [33.9416, -118.4085], city: 'Los Angeles' },
  'HND': { coords: [35.5533, 139.7810], city: 'Tokyo' }, // Haneda
  'SFO': { coords: [37.6213, -122.3790], city: 'San Francisco' },
  'JFK': { coords: [40.6413, -73.7781], city: 'New York' } // JFK
};

type Props = {
  departure: string;
  arrival: string;
  width?: number;
  height?: number;
};

export default function MapPreview({ departure, arrival, width = 200, height = 100 }: Props) {
  const [mapData, setMapData] = useState<{ states: GeoJSONCollection; countries: GeoJSONCollection } | null>(null);
  
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const [statesData, countriesData] = await Promise.all([
          require('../assets/maps/states.json'),
          require('../assets/maps/countries.json')
        ]);
        setMapData({ states: statesData, countries: countriesData });
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };
    loadMapData();
  }, []);

  if (!mapData) return null;

  // Get coordinates for departure and arrival
  const depAirport = airports[departure];
  const arrAirport = airports[arrival];
  if (!depAirport || !arrAirport) return null;

  const depCoords = depAirport.coords;
  const arrCoords = arrAirport.coords;

  // Calculate the bounding box
  const isInternational = Math.abs(depCoords[1] - arrCoords[1]) > 30 || // If longitude difference > 30 degrees
                         !((depCoords[1] > -130 && depCoords[1] < -60) && // or if not both in US
                           (arrCoords[1] > -130 && arrCoords[1] < -60));

  // Create a buffer around the route to include nearby states/countries
  const line = turf.lineString([[depCoords[1], depCoords[0]], [arrCoords[1], arrCoords[0]]]);
  const distance = turf.distance(
    turf.point([depCoords[1], depCoords[0]]),
    turf.point([arrCoords[1], arrCoords[0]]),
    { units: 'degrees' }
  );
  
  // Adjust padding based on flight distance and map aspect ratio
  const aspectRatio = width / height;
  const basePadding = isInternational ? 0.2 : 0.3;
  const padding = Math.min(basePadding, distance * 0.2);
  
  // Create a buffered line for the route
  const buffered = turf.buffer(line, distance * padding, { units: 'degrees' });
  const bbox = buffered ? turf.bbox(buffered) : turf.bbox(line);
  
  // Add extra padding for city labels
  const bboxWidth = bbox[2] - bbox[0];
  const bboxHeight = bbox[3] - bbox[1];
  const labelPadding = Math.max(bboxWidth, bboxHeight) * 0.1; // 10% padding for labels
  
  bbox[0] -= labelPadding;
  bbox[2] += labelPadding;
  bbox[1] -= labelPadding;
  bbox[3] += labelPadding;
  
  // Adjust bbox to maintain aspect ratio
  const adjustedBboxWidth = bbox[2] - bbox[0];
  const adjustedBboxHeight = bbox[3] - bbox[1];
  const bboxAspectRatio = adjustedBboxWidth / adjustedBboxHeight;
  
  if (bboxAspectRatio > aspectRatio) {
    // Too wide, need to increase height
    const targetHeight = adjustedBboxWidth / aspectRatio;
    const heightDiff = targetHeight - adjustedBboxHeight;
    bbox[1] -= heightDiff / 2;
    bbox[3] += heightDiff / 2;
  } else {
    // Too tall, need to increase width
    const targetWidth = adjustedBboxHeight * aspectRatio;
    const widthDiff = targetWidth - adjustedBboxWidth;
    bbox[0] -= widthDiff / 2;
    bbox[2] += widthDiff / 2;
  }
  
  const viewMinLon = bbox[0];
  const viewMinLat = bbox[1];
  const viewMaxLon = bbox[2];
  const viewMaxLat = bbox[3];

  // Convert lat/long to x/y coordinates
  const coordToPixel = (coord: [number, number]): [number, number] => {
    const x = ((coord[0] - viewMinLon) / (viewMaxLon - viewMinLon)) * width;
    const y = height - ((coord[1] - viewMinLat) / (viewMaxLat - viewMinLat)) * height;
    return [x, y];
  };

  const depPixel = coordToPixel([depCoords[1], depCoords[0]]);
  const arrPixel = coordToPixel([arrCoords[1], arrCoords[0]]);
  const depX = depPixel[0];
  const depY = depPixel[1];
  const arrX = arrPixel[0];
  const arrY = arrPixel[1];

  // Calculate control points for curved line
  const dx = arrX - depX;
  const dy = arrY - depY;
  const midX = depX + dx * 0.5;
  const midY = depY + dy * 0.5;
  const curvature = isInternational ? 0.4 : 0.2;
  const controlX = midX;
  const controlY = midY - Math.sqrt(dx * dx + dy * dy) * curvature;

  // Calculate airplane position (at the midpoint of the curve)
  const t = 0.5; // Midpoint
  const curveX = Math.pow(1 - t, 2) * depX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * arrX;
  const curveY = Math.pow(1 - t, 2) * depY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * arrY;
  
  // Calculate angle for airplane rotation - point towards destination
  const angle = Math.atan2(arrY - depY, arrX - depX) * (180 / Math.PI);

  // Calculate plane size and offsets
  const planeSize = 0.015;
  const planeWidth = 512 * planeSize;
  const planeHeight = 384 * planeSize;
  const verticalOffset = planeHeight / 2;
  const horizontalOffset = planeWidth / 2;

  // Convert coordinates to SVG path
  const coordinatesToPath = (geometry: GeoJSONFeature['geometry']): string => {
    if (!geometry.coordinates.length) return '';

    const paths: string[] = [];
    
    if (geometry.type === 'Polygon') {
      const coords = geometry.coordinates as number[][][];
      coords.forEach(ring => {
        const path = ring.map((coord, i) => {
          const [x, y] = coordToPixel([coord[0], coord[1]]);
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
        paths.push(path + 'Z');
      });
    } else if (geometry.type === 'MultiPolygon') {
      const coords = geometry.coordinates as number[][][][];
      coords.forEach(polygon => {
        polygon.forEach(ring => {
          const path = ring.map((coord, i) => {
            const [x, y] = coordToPixel([coord[0], coord[1]]);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');
          paths.push(path + 'Z');
        });
      });
    }

    return paths.join(' ');
  };

  // Get map features to display
  const getMapPaths = () => {
    const paths: React.ReactNode[] = [];
    
    if (!isInternational) {
      // For domestic flights, show all US states
      mapData.states.features.forEach((feature, index) => {
        const svgPath = coordinatesToPath(feature.geometry);
        if (svgPath) {
          paths.push(
            <Path
              key={`state-${index}`}
              d={svgPath}
              fill="#a5d6a7"
              stroke="#66bb6a"
              strokeWidth="0.5"
            />
          );
        }
      });
    } else {
      // For international flights, show relevant countries
      mapData.countries.features.forEach((feature, index) => {
        const svgPath = coordinatesToPath(feature.geometry);
        if (svgPath) {
          paths.push(
            <Path
              key={`country-${index}`}
              d={svgPath}
              fill="#a5d6a7"
              stroke="#66bb6a"
              strokeWidth="0.5"
            />
          );
        }
      });
    }
    
    return paths;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Ocean background */}
        <Rect x="0" y="0" width={width} height={height} fill="#e6f3ff" />
        
        {/* Map features */}
        <G>{getMapPaths()}</G>
        
        {/* Flight path */}
        <Path
          d={`M ${depX} ${depY} Q ${controlX} ${controlY} ${arrX} ${arrY}`}
          stroke="#f4511e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4,4"
        />

        {/* Departure point and city name */}
        <G>
          <Circle
            cx={depX}
            cy={depY}
            r="3"
            fill="#f4511e"
          />
          <Text
            x={depX}
            y={depY - 10}
            fill="#333"
            fontSize="10"
            textAnchor="middle"
          >
            {depAirport.city}
          </Text>
        </G>

        {/* Arrival point and city name */}
        <G>
          <Circle
            cx={arrX}
            cy={arrY}
            r="3"
            fill="#f4511e"
          />
          <Text
            x={arrX}
            y={arrY - 10}
            fill="#333"
            fontSize="10"
            textAnchor="middle"
          >
            {arrAirport.city}
          </Text>
        </G>

        {/* Airplane icon */}
        <G
          transform={`translate(${curveX},${curveY}) rotate(${angle}) translate(${-horizontalOffset},${-verticalOffset}) scale(${planeSize})`}
          fill="#f4511e"
        >
          <Path d="M480 192H365.71L260.61 8.06A16.014 16.014 0 0 0 246.71 0h-65.5c-10.63 0-18.3 10.17-15.38 20.39L214.86 192H112l-43.2-57.6c-3.02-4.03-7.77-6.4-12.8-6.4H16.01C5.6 128-2.04 137.78.49 147.88L32 256 .49 364.12C-2.04 374.22 5.6 384 16.01 384H56c5.04 0 9.78-2.37 12.8-6.4L112 320h102.86l-49.03 171.6c-2.92 10.22 4.75 20.4 15.38 20.4h65.5c5.74 0 11.04-3.08 13.89-8.06L365.71 320H480c35.35 0 96-28.65 96-64s-60.65-64-96-64z"/>
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
});
