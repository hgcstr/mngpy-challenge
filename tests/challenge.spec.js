import { test, expect } from "@playwright/test";
import GoogleMapsPage from "../pages/googleMapsPage";
import { getZoomLevelFromUrl } from "../utilities/utils";

const gMapsEnglishUrl = "/maps?hl=en";

const testCities = {
  paris: {
    name: "Paris",
    urlPlaceName: "/place/Paris,+France",
  },
  newYork: {
    name: "New York",
    urlPlaceName: "/place/New+York,+NY,+USA",
  },
  lima: {
    name: "Lima",
    urlPlaceName: "/place/Lima,+Peru",
  },
  london: {
    name: "London",
    urlPlaceName: "/place/London,+UK",
  },
  berlin: {
    name: "Berlin",
    urlPlaceName: "/Berlin/",
  },
  invalid: {
    name: "6td46t634d",
    urlPlaceName: "none",
  },
};

const nearbyValues = ["Restaurants", "Hotels", "Bars and pubs"];
const zoomLevelLimits = { min: 3, max: 21 };

test.describe("Happy tests", () => {
  test("AC01", async ({ page }) => {
    await page.goto(gMapsEnglishUrl);

    const googleMapsPage = new GoogleMapsPage(page);
    await googleMapsPage.rejectAllCookies();
    await googleMapsPage.searchCity(testCities.paris.name);
    const headlineText = await googleMapsPage.getHealineText();
    expect(headlineText).toBe(testCities.paris.name);
  });

  test("AC02", async ({ page }) => {
    await page.goto(gMapsEnglishUrl);

    const googleMapsPage = new GoogleMapsPage(page);
    await googleMapsPage.rejectAllCookies();
    await googleMapsPage.searchCity(testCities.london.name);
    const headlineText = await googleMapsPage.getHealineText();
    expect(headlineText).toBe(testCities.london.name);
    await googleMapsPage.clickDirectionsButton();
    const destinationText = await googleMapsPage.getDestinationText();
    expect(destinationText).toContain(testCities.london.name);
  });

  test("AC03", async ({ page }) => {
    await page.goto(gMapsEnglishUrl);

    const googleMapsPage = new GoogleMapsPage(page);
    await googleMapsPage.rejectAllCookies();
    await googleMapsPage.searchCity(testCities.newYork.name);
    const headlineText = await googleMapsPage.getHealineText();
    expect(headlineText).toBe(testCities.newYork.name);

    // await page.waitForURL(`**${testCities.newYork.urlPlaceName}/**`); //didn't work
    await page.waitForTimeout(2000);
    let currentUrl = await page.url();
    expect(currentUrl).toContain(testCities.newYork.urlPlaceName);

    let initialZoomLevel = getZoomLevelFromUrl(currentUrl);

    await googleMapsPage.clickZoomIn();

    await page.waitForTimeout(2000);

    let newUrl = await page.url();
    let newZoomLevel = getZoomLevelFromUrl(newUrl);
    expect(newZoomLevel).toBeGreaterThan(initialZoomLevel);
  });

  test("AC04", async ({ page }) => {
    await page.goto(gMapsEnglishUrl);

    const googleMapsPage = new GoogleMapsPage(page);
    await googleMapsPage.rejectAllCookies();
    await googleMapsPage.searchCity(testCities.berlin.name);
    const headlineText = await googleMapsPage.getHealineText();
    expect(headlineText).toBe(testCities.berlin.name);
    await googleMapsPage.clickNearbyButton();
    const values = await googleMapsPage.getNearbySuggestions();

    expect(values).toEqual(nearbyValues);
  });
});

test.describe("Unhappy tests", () => {
  test("AC06", async ({ page }) => {
    await page.goto(gMapsEnglishUrl);

    const googleMapsPage = new GoogleMapsPage(page);
    await googleMapsPage.rejectAllCookies();
    await googleMapsPage.searchCity(testCities.invalid.name);

    const canNotFindText = await googleMapsPage.getCantFindLabelText();
    // const canNotFindText = await page.locator(".Q2vNVc").innerText();
    expect(canNotFindText).toBe(
      `Google Maps can't find ${testCities.invalid.name}`
    );
  });
});

test.describe("Boundary tests", () => {
  test("AC05", async ({ page }) => {
    await page.goto(gMapsEnglishUrl);

    const googleMapsPage = new GoogleMapsPage(page);
    await googleMapsPage.rejectAllCookies();
    await googleMapsPage.searchCity(testCities.lima.name);
    const headlineText = await googleMapsPage.getHealineText();
    expect(headlineText).toBe(testCities.lima.name);

    await page.waitForTimeout(3000);
    let currentUrl = await page.url();
    let initialZoomLevel = getZoomLevelFromUrl(currentUrl);
    await googleMapsPage.zoomToMaxOrMin(
      initialZoomLevel,
      zoomLevelLimits,
      "in"
    );
    await page.waitForTimeout(500);
    const zoomInButton = await googleMapsPage.getZoomInButton();
    const isZoomInDisabled = await zoomInButton.isDisabled();
    expect(isZoomInDisabled).toBe(true);

    await page.waitForTimeout(3000);
    currentUrl = await page.url();
    initialZoomLevel = getZoomLevelFromUrl(currentUrl);
    await googleMapsPage.zoomToMaxOrMin(
      initialZoomLevel,
      zoomLevelLimits,
      "out"
    );
    await page.waitForTimeout(500);
    const zoomOutButton = await googleMapsPage.getZoomOutButton();
    const isZoomOutDisabled = await zoomOutButton.isDisabled();
    expect(isZoomOutDisabled).toBe(true);
  });
});
