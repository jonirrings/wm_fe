import { useLocation, useMatches, useOutlet } from "react-router-dom";
import { useEffect, useState } from "react";

interface MatchRouteType {
  pathname: string;
  children: any;
  routePath: string;
}

export default function useMatchRoute() {
  const matches = useMatches();
  const children = useOutlet();
  const { pathname } = useLocation();

  const [matchRoute, setMatchRoute] = useState<MatchRouteType | undefined>();

  useEffect(() => {
    // 获取当前匹配的路由
    const lastRoute = matches.at(-1);
    if (!lastRoute?.pathname) return;

    setMatchRoute({
      pathname,
      children,
      routePath: lastRoute.pathname,
    });
  }, [pathname]);

  return matchRoute;
}
