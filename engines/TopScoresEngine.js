import * as Server from '../servers/Server.js'

let top_scores = undefined

export async function load_top_scores() {
    top_scores = await Server.fetch_top_scores()
    return top_scores
}

export async function handle_new_score(first_name, score) {
    let top_score_10 = undefined
    if (top_scores.length === 10) {
        top_score_10 = top_scores[9][1]
    }
    
    if (top_score_10 === undefined || top_score_10 < score) {
        await Server.save_score(first_name, score)
        top_scores = Server.fetch_top_scores()
    }

    return top_scores
}