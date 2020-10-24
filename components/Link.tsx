/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
// import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink, { LinkProps } from 'next/link';
import MuiLink from '@material-ui/core/Link';
import { UrlObject } from 'url';

const NextComposed = React.forwardRef<
  typeof NextLink & HTMLAnchorElement,
  LinkProps & { className?: string }
>(function NextComposed(props, ref) {
  const {
    as,
    href,
    replace,
    scroll,
    passHref,
    shallow,
    prefetch,
    ...other
  } = props;

  return (
    <NextLink
      href={href}
      prefetch={prefetch}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
    >
      <a ref={ref} {...other} />
    </NextLink>
  );
});

type Props = {
  children?: React.ReactNode;
  activeClassName?: string;
  as?: string | {};
  className?: string;
  href: string | (string & UrlObject);
  innerRef?: any; // 降参。(node:any)=>void でもダメなの?
  naked?: boolean;
  onClick?: () => void;
  prefetch?: boolean;
};
// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link(props: LinkProps & Props) {
  const {
    href,
    activeClassName = 'active',
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === 'string' ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName
  });

  if (naked) {
    return (
      <NextComposed
        className={className}
        ref={innerRef}
        href={href}
        {...other}
      />
    );
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href}
      {...other}
    />
  );
}

// Link.propTypes = {
//   activeClassName: PropTypes.string,
//   as: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//   className: PropTypes.string,
//   href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//   innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
//   naked: PropTypes.bool,
//   onClick: PropTypes.func,
//   prefetch: PropTypes.bool
// };

export default React.forwardRef<
  typeof Link,
  //LinkProps & Props
  React.ComponentPropsWithoutRef<typeof Link>
>((props, ref) => <Link {...props} innerRef={ref} />);
