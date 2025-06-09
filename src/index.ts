import fetch from 'node-fetch';
import * as fs from'fs';

const API_URL = 'https://challenge.sunvoy.com/api/users';
const COOKIE = 'JSESSIONID=bff0b105-fba7-4c14-a9eb-629e97bc8c42; _csrf_token=1501bdaeaa101de1fb210d3a2e9f56345b8336ed1e372d9abb674fe759ccbac3; user_preferences=eyJ0aGVtZSI6ImxpZ2h0IiwibGFuZ3VhZ2UiOiJlbiIsInRpbWV6b25lIjoiVVRDIiwibm90aWZpY2F0aW9ucyI6dHJ1ZX0%3D; analytics_id=analytics_a60a6b1cdbd939304b7297b4eae505f9; session_fingerprint=47db4aaee40f5f456778314eda979937362f62c809a570fe9c709eddcc9a42c7; feature_flags=eyJuZXdEYXNoYm9hcmQiOnRydWUsImJldGFGZWF0dXJlcyI6ZmFsc2UsImFkdmFuY2VkU2V0dGluZ3MiOnRydWUsImV4cGVyaW1lbnRhbFVJIjpmYWxzZX0%3D; tracking_consent=accepted; device_id=device_0727ed557bbad10017494546';


async function fetchUsers() {
    try{
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Cookie': COOKIE,
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const users = await response.json();

        const formatted = JSON.stringify(users, null, 2);
        fs.writeFileSync('users.json', formatted);
        console.log( 'users.json created successfully' );

    }
    catch(error){
        console.error("Error fetching users: ", error);

    }
    
}
fetchUsers();