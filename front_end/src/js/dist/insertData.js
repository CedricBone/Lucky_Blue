console.log("INSERT");
let _name = document.getElementById('game_name').value;
let _url = document.getElementById('game_url').value;
console.log(_name, _url);
const button = document.getElementById('add_game_submit');
button.addEventListener('click', async event => {
    const data = { _name, _url };
    console.log(data);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const json = await response.json();
});