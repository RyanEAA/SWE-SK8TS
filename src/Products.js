
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
            id:1,
            name:'Skateboard1',
            price:100.00,
            image:'/Images/skate_photo.jpg'
        },
        {
            id:2,
            name:'Sweater1',
            price:33.00,
            image:'/Images/sweater_photo.jpg'
        },
        {
            id:3,
            name:'Skateboard2',
            price:50.00,
            image:'/Images/skate_photo.jpg'
        },
        {
            id:4,
            name:'Sweater2',
            price:25.00,
            image:'/Images/sweater_photo.jpg'
        },
        {
            id:5,
            name:'Sweater3',
            price:12.00,
            image:'/Images/sweater_photo.jpg'
        },
        {
            id:6,
            name:'Shoe1',
            price:22.00,
            image:'/Images/shoe_photo.jpg'
        },
        {
            id:7,
            name:'Shoe2',
            price:21.00,
            image:'/Images/shoe_photo.jpg'
        }
    ]
    
}