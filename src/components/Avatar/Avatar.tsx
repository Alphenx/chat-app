import { Avatar as ChakraAvatar } from '@chakra-ui/react';
import { ImgHTMLAttributes, Ref } from 'react';

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export interface AvatarProps extends ChakraAvatar.RootProps {
  ref?: Ref<HTMLDivElement>;
  src?: string | null;
  srcSet?: string;
  loading?: ImageProps['loading'];
}

function Avatar({ src, srcSet, loading, ref, ...rest }: AvatarProps) {
  return (
    <ChakraAvatar.Root ref={ref} {...rest}>
      <ChakraAvatar.Fallback />
      <ChakraAvatar.Image src={src ?? undefined} srcSet={srcSet} loading={loading} />
    </ChakraAvatar.Root>
  );
}

export default Avatar;
