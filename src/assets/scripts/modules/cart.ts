import { fetchConfig, randomId } from "../application/utils"

export function changeCartItemByLine(body) {
    return fetch(`/cart/change.js`, {
        ...fetchConfig(),
        ...{ body },
    }).then((res) => res.json());
};

export function updateCart(body) {
    return fetch(`/cart/update.js`, {
        ...fetchConfig(),
        ...{ body },
    }).then((res) => res.json());
};


export function applyCartDiscount(code: string) {
    return fetch(
        `/discount/${code}`,
        { method: 'GET' }
    )
}

export function addItemsToCart(body) {
    const config = fetchConfig();

    config.body = JSON.stringify(body);

    return fetch(`/cart/add.js`, config).then((res) => res.json());
}


export function transformFormDataForCart(formData: FormData): PotentialCartItems[] {
    const obj  = Object.fromEntries(formData);
    const { id, quantity = 1 } = obj;
    if(!id) return null;

    const transactionId = randomId();
    const properties = Object.entries(obj).reduce((properties, [key, value]) => {
        var matches = key.match(/\[(.*?)\]/);

        if(!key.startsWith('properties') || !matches) return properties;

        let name = matches[1];

        properties[name] = value;

        return properties;
    }, {});

    const primaryItem = {
        id: Number(id),
        quantity: Number(quantity),
        properties
    };

    const addonItems = Object.entries(obj)
                            .filter(([key]) => key.startsWith('id_'))
                            .map(([key, value]) => {
                                const name = key.replace(/^id_/i, '');
                                const itemProperties = Object.entries(properties).reduce((props, [key, value]) => {

                                    // This needs adjusting to not match both 'Engraving' and 'Engraving 2'
                                    // when name == 'Engraving'
                                    if(key.startsWith(name)) {
                                        props[key] = value;
                                    }

                                    return props;
                                }, {})

                                return {
                                    quantity,
                                    id: Number(value),
                                    properties: {
                                        ...itemProperties,
                                        _addon: String(true),
                                        _bundle: transactionId,
                                    },
                                }
                            });

    if(addonItems.length) {
        primaryItem.properties['_bundle'] = transactionId;
        primaryItem.properties['_parent'] = String(true);
    }

    console.log('Transform Cart Data', {
        properties,
        obj,
        primaryItem,
        addonItems,
    });
    
    return [ 
        ...addonItems,
        primaryItem,
    ]
}


interface PotentialCartItems {
    id: Number,
    quantity: Number,
    properties?: {
        [key: string]: any,
    }
}