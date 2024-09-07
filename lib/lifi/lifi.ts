import {
  convertQuoteToRoute,
  executeRoute,
  getQuote,
  QuoteRequest,
  Route,
} from "@lifi/sdk";
import { base } from "viem/chains";
import { USDC_BASE_ADDRESS } from "../constants";
import { createConfig } from "@lifi/sdk";

export const lifi = createConfig({
  integrator: "Flux",
});

export async function getRoutesResult(
  address: string,
  fromChainId: number,
  fromTokenAddress: string,
  fromAmount: string
) {
  const routesRequest: QuoteRequest = {
    fromChain: fromChainId,
    toChain: base.id,
    fromAddress: address,
    fromToken: fromTokenAddress,
    toToken: USDC_BASE_ADDRESS,
    fromAmount,
    order: "FASTEST" as const,
  };

  const result = await getQuote(routesRequest);
  //convert route to quote
  const route = convertQuoteToRoute(result);
  return route;
}

export async function executeRouteTransaction(route: Route) {
  const executedRoute = await executeRoute(route, {
    updateRouteHook(route) {
      console.log("Route updated:", route.id);
    },
  });
  return executedRoute;
}
