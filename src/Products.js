
async function fetchData(){
    try{
        const response = await fetch('http://167.71.25.102:3636/products')

        if(!response.ok){
            throw new Error('Could not fetch')
        }
        const data = await response.json()
        return data
    }
    catch(error){
        console.error(error)
    }
}

const data = await fetchData()

export const PRODUCTS = {
    products: [
        {
            id:data[0].product_id,
            name:data[0].name,
            price:data[0].price,
            description:data[0].description,
            image:'https://image.pollinations.ai/prompt/Street%20King%20Skateboard%0ADurable%207-ply%20maple%20deck%20with%20responsive%20trucks%20and%20smooth%20wheels.%20Perfect%20for%20street%20skating%20and%20tricks.?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        },
        {
            id:data[1].product_id,
            name:data[1].name,
            price:data[1].price,
            description:data[1].description,
            image:'https://image.pollinations.ai/prompt/Pro%20Stunt%20Skateboard%0AHigh-quality%20deck%20with%20reinforced%20trucks%20and%20fast%20bearings.%20Ideal%20for%20advanced%20tricks%20and%20competition%20use.%0A?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        },
        {
            id:data[2].product_id,
            name:data[2].name,
            price:data[2].price,
            description:data[2].description,
            image:'https://image.pollinations.ai/prompt/Cruiser%20Wave%20Board%0ASmooth-riding%20cruiser%20with%20soft%20wheels%20for%20city%20and%20campus%20commuting.%20Lightweight%20and%20compact.%0A?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        },
        {
            id:data[3].product_id,
            name:data[3].name,
            price:data[3].price,
            description:data[3].description,
            image:'https://image.pollinations.ai/prompt/Downhill%20Speed%20Longboard%0ADesigned%20for%20high-speed%20downhill%20rides%20with%20precision%20bearings%20and%20a%20drop-through%20deck.%0A?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        },
        {
            id:data[4].product_id,
            name:data[4].name,
            price:data[4].price,
            description:data[4].description,
            image:'https://image.pollinations.ai/prompt/Freestyle%20Dancing%20Longboard%0AFlexy%20bamboo%20deck%20with%20responsive%20trucks.%20Perfect%20for%20longboard%20dancing%20and%20freestyle%20tricks.%20red%0A?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        },
        {
            id:data[5].product_id,
            name:data[5].name,
            price:data[5].price,
            description:data[5].description,
            image:'https://image.pollinations.ai/prompt/Freestyle%20Dancing%20Longboard%0AFlexy%20bamboo%20deck%20with%20responsive%20trucks.%20Perfect%20for%20longboard%20dancing%20and%20freestyle%20tricks.%0A?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        },
        {
            id:data[6].product_id,
            name:data[6].name,
            price:data[6].price,
            description:data[6].description,
            image:'https://image.pollinations.ai/prompt/All-Terrain%20Off-Road%20Board%0APneumatic%20tires%20with%20a%20sturdy%20deck%20for%20off-road%20and%20trail%20riding.%20Great%20for%20adventure%20seekers.%20Black%0A?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        },
        {
            id:data[7].product_id,
            name:data[7].name,
            price:data[7].price,
            description:data[7].description,
            image:'https://image.pollinations.ai/prompt/Electric%20Skateboard%20Turbo-X%0APowerful%20dual-motor%20electric%20skateboard%20with%20a%20top%20speed%20of%2025%20mph%20and%20long%20battery%20life.%20colorful%0A?width=1280&height=1280&seed=46811&nologo=true&model=flux'
        }
    ]
    
}