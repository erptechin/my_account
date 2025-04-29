import React, { forwardRef, memo } from 'react';
import { headingStyle } from './styles';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { cssInterop } from 'nativewind';
import { Text } from 'react-native';

type IHeadingProps = VariantProps<typeof headingStyle> &
  React.ComponentPropsWithoutRef<typeof Text> & {
    as?: React.ElementType;
  };

cssInterop(Text, { className: 'style' });
cssInterop(Text, { className: 'style' });
cssInterop(Text, { className: 'style' });
cssInterop(Text, { className: 'style' });
cssInterop(Text, { className: 'style' });
cssInterop(Text, { className: 'style' });

const MappedHeading = memo(
  forwardRef<React.ElementRef<typeof Text>, IHeadingProps>(
    (
      {
        size,
        className,
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
        ...props
      },
      ref
    ) => {
      switch (size) {
        case '5xl':
        case '4xl':
        case '3xl':
          return (
            <Text
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case '2xl':
          return (
            <Text
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'xl':
          return (
            <Text
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'lg':
          return (
            <Text
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'md':
          return (
            <Text
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'sm':
        case 'xs':
          return (
            <Text
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        default:
          return (
            <Text
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
      }
    }
  )
);

const Heading = memo(
  forwardRef<React.ElementRef<typeof Text>, IHeadingProps>(
    ({ className, size = 'lg', as: AsComp, ...props }, ref) => {
      const {
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
      } = props;

      if (AsComp) {
        return (
          <AsComp
            className={headingStyle({
              size,
              isTruncated,
              bold,
              underline,
              strikeThrough,
              sub,
              italic,
              highlight,
              class: className,
            })}
            {...props}
          />
        );
      }

      return (
        <MappedHeading className={className} size={size} ref={ref} {...props} />
      );
    }
  )
);

Heading.displayName = 'Heading';

export { Heading };
