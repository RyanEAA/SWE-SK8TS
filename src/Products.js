
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
            image:'/Images/skate_photo.jpg'
        },
        {
            id:data[1].product_id,
            name:data[1].name,
            price:data[1].price,
            description:data[1].description,
            image:'/Images/sweater_photo.jpg'
        },
        {
            id:data[2].product_id,
            name:data[2].name,
            price:data[2].price,
            description:data[2].description,
            image:'/Images/skate_photo.jpg'
        },
        {
            id:data[3].product_id,
            name:data[3].name,
            price:data[3].price,
            description:data[3].description,
            image:'/Images/sweater_photo.jpg'
        },
        {
            id:data[4].product_id,
            name:data[4].name,
            price:data[4].price,
            description:data[4].description,
            image:'/Images/sweater_photo.jpg'
        },
        {
            id:data[5].product_id,
            name:data[5].name,
            price:data[5].price,
            description:data[5].description,
            image:'/Images/shoe_photo.jpg'
        },
        {
            id:data[6].product_id,
            name:data[6].name,
            price:data[6].price,
            description:data[6].description,
            image:'/Images/shoe_photo.jpg'
        },
        {
            id:data[7].product_id,
            name:data[7].name,
            price:data[7].price,
            description:data[7].description,
            image:'/Images/shoe_photo.jpg'
        }
    ]
    
}