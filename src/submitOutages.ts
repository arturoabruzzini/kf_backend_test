import { getOutages, getSiteInfo, postSiteOutages } from "./api";

const site = "norwich-pear-tree";
const earliestOutage = "2022-01-01T00:00:00.000Z";

export const submitOutages = async () => {
  const outages = await getOutages();
  const siteInfo = await getSiteInfo(site);

  const outagesWithDeviceName = outages.map((outage) => ({
    ...outage,
    name: siteInfo.devices.find((device) => device.id === outage.id)?.name,
  }));

  const filteredOutages = outagesWithDeviceName.filter(
    (outage) => outage.begin >= earliestOutage && outage.name
  );

  await postSiteOutages(site, filteredOutages);

  console.log(`${filteredOutages.length} site outages posted successfully`);
};
