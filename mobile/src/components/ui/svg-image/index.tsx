'use client';
import React from 'react';
import { Platform } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { Image } from '../image';

const SvgImage = (props: any) => {
  if (Platform.OS === 'web') {
    return <Image {...props} source={props.source} className={`w-[${props.width}] h-[${props.height}]`} />
  }
  return (
    <SvgUri
      width={props.width}
      height={props.height}
      source={props.source}
    />
  );
};

export { SvgImage };
