// let BASE_URL = 'http://localhost:1990'
let BASE_URL = 'https://maak-me-slaaang-server.vercel.app'

export async function fetch_top_scores() {
    let response = await fetch(BASE_URL + '/top.json')
    return response.json()
}

export async function save_score(first_name, score) {
    await fetch(BASE_URL + '/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([first_name, score]),
    })
}