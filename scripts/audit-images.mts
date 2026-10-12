import { catalog, groups, groupBanner } from "../src/lib/catalog";
import { existsSync, writeFileSync } from "fs";
const rows: string[] = [];
const chk = (kind: string, id: string, src?: string) => {
  let st = "ok";
  if (!src) st = "MISSING";
  else if (/^https?:/.test(src)) st = "REMOTE";
  else if (!existsSync("public" + decodeURI(src))) st = "NOFILE";
  rows.push([kind, id, st, src ?? ""].join("\t"));
};
for (const c of catalog) chk("product", c.id, c.photo);
for (const g of groups) { chk("section", g.slug, groupBanner(g)); for (const s of g.subs) chk("tile", g.slug + "/" + s.slug, s.image ?? s.thumb); }
writeFileSync("/tmp/audit.tsv", rows.join("\n") + "\n");
