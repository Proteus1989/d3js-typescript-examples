# Italy COVID 19 
#### Infected cases represented by circles and colors

In this example a Italy map is printed showing different sets of coronavirus data.    

![map affected coronavirus](./content/chart.png "affected coronavirus")

# Installation

- Execute _npm install_

```bash
npm install
```

# Run

- This project includes `parcel` dev-module. Therefore, to run the app just need to execute _npm start_. 

```bash
npm start
```

# Code Annotations

Typing communities
```typescript
export interface LongLatCommunity
{
    name: string,
    long: number,
    lat: number
}
```
Adding the animation
```typescript
svg.selectAll<HTMLDivElement, LongLatCommunity>("circle")
    .transition().duration(500)
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data))
    .on("mouseover", function(d) {
      mouseOver(d, data);
    })
    .on("mouseout", function(d, i) {
      mouseOut(this);
});
```
Mapping community names
```typescript
export const mapping = {
    "Lombardia": "Lombardy",
    "Emilia-Romagna": "Emilia Romagna",
    "Veneto": "Veneto",
    "Piemonte": "Piemonte",
    "Marche": "Marche",
    "Toscana": "Tuscany",
    "Liguria": "Liguria",
    "Lazio": "Lazio",
    "Campania": "Campania",
    "Trentino-Alto Adige": "Trentino",
    "Apulia": "Puglia",
    "Friuli-Venezia Giulia": "Friuli V.G.",
    "South Tyrol": "South Tyrol",
    "Sicily": "Sicily",
    "Abruzzo": "Abruzzo",
    "Umbria": "Umbria",
    "Valle d'Aosta": "Valle d'Aosta",
    "Sardegna": "Sardinia",
    "Calabria": "Calabria",
    "Basilicata": "Basilicata",
    "Molise": "Molise" 
}
```
Changing community color
```typescript
svg
    .selectAll("path")
    .transition().duration(500)
    .attr("fill", (d) => getColorByFeatureCommunity(d, data));
```
Calculating the color
```typescript
const getColorByFeatureCommunity = (d, data) => {
    const color = getColor(mapCommunity(d["properties"]["NAME_1"]), data);
    return `hsla(360,90%,${color}%,1)`;
};
```

# Acknowledgements

- Italy topojson info: <br>
https://github.com/deldersveld/topojson/blob/master/countries/italy/italy-regions.json
- Lemoncode / d3js-typescript-examples <br>
https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale