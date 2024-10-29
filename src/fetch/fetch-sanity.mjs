import client from "./sanity-config.mjs";

const query = `*[_type in ["catch-the-vibes","trending","men-T_shirts-latest","men-jeans-latest","shorts-latest","tops","vintage-shirts","boy-friend-jeans","Cargo-pants",]]{_id,_updatedAt, _type, name,originalPrice,price, "imageUrl": image.asset->url}`;
const excludedIds = ['status-asset', 'services-bg', 'services-card2-bg','trailoring-machines','wholesale-bales'];
const params = { excludedIds };
export async function justpull(){
    const fetch = await client.fetch(query,params);
    const response = fetch;
    //console.log( 'printing response ',response);
    return response;
}
justpull();

export async function grabT_shirts(){
    const query = `*[_type == "men-T_shirts-latest"]{_id, _type, name,originalPrice,price, "imageUrl": image.asset->url}`;
    const fetch = await client.fetch(query);
    const response = fetch;
    return response;
}
grabT_shirts() ;