import { SideMenu } from "../utils/types.ts";
import { items } from "./items.ts";
import { rooms } from "./rooms.ts";
import { shelf } from "./shelf.ts";

export const defaultMenus: SideMenu[] = [items, shelf, rooms];
