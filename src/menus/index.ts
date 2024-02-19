import { SideMenu } from "../utils/types";
import { items } from "./items";
import { rooms } from "./rooms";
import { shelf } from "./shelf";
import { stock } from "./stock.ts";

export const defaultMenus: SideMenu[] = [stock, items, shelf, rooms];
