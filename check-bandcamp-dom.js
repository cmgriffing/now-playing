customDomainMetaData = {"isBandcamp":false};
// check if DOM for Bandcamp meta-tags.
// examples: ["https://store.terminalsoundsystem.com/", "https://music.bennysmiles.com/"].
var generator = document.querySelector('meta[name="generator"]');
var twitterSite = document.querySelector('meta[property="twitter:site"]');
if((generator && generator.content === "Bandcamp") ||
  (twitterSite && twitterSite.content === "@bandcamp"))
{
  customDomainMetaData.isBandcamp = true;
} 
customDomainMetaData;
