import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ProductsProvider } from './context/products_context'
import { FilterProvider } from './context/filter_context'
import { CartProvider } from './context/cart_context'
import { AvatarsProvider } from './context/avatars_context'
import { UserProvider } from './context/user_context'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.render(
    <Auth0Provider
        domain="dev-4af64q1k.us.auth0.com"
        clientId="68Tulb9G8et1YFajA1GPfx4EcEP3cxHZ"
        redirectUri={window.location.origin}
        cacheLocation="localstorage"
    >
        <UserProvider>
            <ProductsProvider>
                <AvatarsProvider>
                    <FilterProvider>
                        <CartProvider>
                            <App />
                        </CartProvider>
                    </FilterProvider>
                </AvatarsProvider>
            </ProductsProvider>
        </UserProvider>
    </Auth0Provider>
, document.getElementById('root'))
