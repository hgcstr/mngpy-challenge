export default class GoogleMapsPage {
  constructor(page) {
    this.page = page;
  }

  async rejectAllCookies() {
    const rejectButton = this.page
      .locator(
        "form div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb button[aria-label]:has(span)"
      )
      .first();

    try {
      await rejectButton.waitFor({ timeout: 5000 });
      await rejectButton.click();
    } catch (e) {
      console.log(
        "Reject all cookies button not found or didn't appear in time:"
      );
    }
  }

  async searchCity(searchValue) {
    await this.enterValueToSearch(searchValue);
    await this.clickSearchButton();
  }

  async enterValueToSearch(searchValue) {
    await this.page.fill("#searchboxinput", searchValue);
  }

  async clickSearchButton() {
    await this.page.click("#searchbox-searchbutton");
  }

  async getHeadlineText() {
    return await this.page.locator(".DUwDvf.lfPIob").innerText();
  }

  async clickDirectionsButton() {
    await this.page.click('button[data-value="Directions"]');
  }

  async clickNearbyButton() {
    await this.page.click('button[data-value="Nearby"]');
  }

  async getDestinationText() {
    return await this.page.locator("#sb_ifc51 input").inputValue();
  }

  async clickZoomIn() {
    await this.page.click("#widget-zoom-in");
  }

  async clickZoomOut() {
    await this.page.click("#widget-zoom-out");
  }

  async getNearbySuggestions() {
    await this.page.waitForSelector("#ydp1wd-haAclf");

    const suggestionLocator = this.page.locator(
      "#ydp1wd-haAclf .DgCNMb span.cGyruf.fontBodyMedium.RYaupb"
    );
    const suggestions = await suggestionLocator.evaluateAll((elements) =>
      elements
        .map((element) => element.innerText.trim())
        .filter((text) => text.length > 0)
    );
    return suggestions;
  }

  async getCantFindLabelText() {
    return await this.page.locator(".Q2vNVc").innerText();
  }

  async zoomToMaxOrMin(currentZoom, zoomLevelLimits, direction) {
    if (direction !== "in" && direction !== "out") {
      throw new Error('Direction must be "in" or "out".');
    }

    while (true) {
      if (direction === "in" && currentZoom < zoomLevelLimits.max) {
        await this.clickZoomIn();
        currentZoom++;
      } else if (direction === "out" && currentZoom > zoomLevelLimits.min) {
        await this.clickZoomOut();
        currentZoom--;
      } else {
        break;
      }
    }
  }

  async getZoomInButton() {
    return await this.page.locator("#widget-zoom-in");
  }
  async getZoomOutButton() {
    return await this.page.locator("#widget-zoom-out");
  }
}
