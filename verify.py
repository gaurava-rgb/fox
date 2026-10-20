"""Screenshot tour of the Foxglove clone — verifies every page renders."""
import os, sys
from playwright.sync_api import sync_playwright

OUT = "/Users/gauravarora/perry/foxglove-shots"
os.makedirs(OUT, exist_ok=True)
BASE = "http://localhost:5175"

ROUTES = [
    ("home", "/"),
    ("pricing", "/pricing"),
    ("about", "/about"),
    ("signin", "/signin"),
    ("overview", "/projects/demo/summary"),
    ("discover", "/projects/demo/discover"),
    ("results", "/projects/demo/results"),
    ("drafts", "/projects/demo/drafts"),
    ("assets", "/projects/demo/assets"),
    ("connectors", "/projects/demo/connectors"),
    ("graph", "/projects/demo/graph"),
    ("flows", "/projects/demo/flows"),
    ("report-visibility", "/projects/demo/reports/search-visibility"),
    ("report-health", "/projects/demo/reports/seo-health"),
    ("billing", "/billing"),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1512, "height": 950})
    ok, bad = [], []
    for name, path in ROUTES:
        try:
            pg.goto(BASE + path, wait_until="networkidle", timeout=20000)
            pg.wait_for_timeout(1600)
            pg.screenshot(path=f"{OUT}/{name}.png", full_page=(name in ("home", "pricing")))
            title = pg.title()
            err = pg.evaluate("() => document.body.innerText.includes('placeholder — being built')")
            (bad if err else ok).append(name)
            print(f"{'!! PLACEHOLDER' if err else 'ok':14} {name:20} {path}")
        except Exception as e:
            bad.append(name)
            print(f"ERROR          {name:20} {str(e)[:70]}")
    # chat interaction test
    try:
        pg.goto(BASE + "/projects/demo/summary", wait_until="networkidle")
        pg.click("text=Ask Foxglove")
        pg.wait_for_timeout(400)
        pg.fill("input[placeholder='Ask Foxglove anything']", "what are my rankings?")
        pg.press("input[placeholder='Ask Foxglove anything']", "Enter")
        pg.wait_for_timeout(4500)
        pg.screenshot(path=f"{OUT}/chat.png")
        print("chat           captured")
    except Exception as e:
        print("chat ERROR", str(e)[:90])
    # subscribe flow test
    try:
        pg.goto(BASE + "/billing", wait_until="networkidle")
        pg.click("text=Subscribe >> nth=0")
        pg.wait_for_timeout(2400)
        pg.screenshot(path=f"{OUT}/billing-subscribed.png")
        print("subscribe      captured ->", "Plan active" in pg.inner_text("body"))
    except Exception as e:
        print("subscribe ERROR", str(e)[:90])
    b.close()
    print(f"\nDONE ok={len(ok)} placeholder/err={len(bad)} {bad if bad else ''}")
