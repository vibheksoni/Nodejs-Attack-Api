const fs = require('fs');
const { type } = require('os');

const db_file = '../Db/users.json';
const admin_file = '../Db/adminkeys.txt';

function GetDatabase() {
    try {
        const data = fs.readFileSync(db_file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return -1;
    }
}

function UserExists(username) {
    const db = GetDatabase();
    if (typeof db === 'number') {
        return false;
    }
    return db.users[username] !== undefined;
}

function AddUser(username, password, hwid, ip, cons, time) {
    const db = GetDatabase();
    if (typeof db === 'number') {
        return false;
    }

    if (UserExists(username)) {
        return false;
    }

    db.users[username] = {
        password: password,
        hwid: hwid,
        ip: ip,
        cons: cons,
        time: time
    };

    fs.writeFile(db_file, JSON.stringify(db), (err) => {
        if (err) {
            return false;
        }
    });

    return true;
}

function RemoveUser(username) {
    const db = GetDatabase();
    if (typeof db === 'number') {
        return false;
    }

    if (!UserExists(username)) {
        return false;
    }

    delete db.users[username];

    fs.writeFile(db_file, JSON.stringify(db), (err) => {
        if (err) {
            return false;
        }
    });

    return true;
}

function UpdateUser(username, password, hwid, ip, cons, time) {
    const db = GetDatabase();
    if (typeof db === 'number') {
        return false;
    }

    if (!UserExists(username)) {
        return false;
    }

    db.users[username] = {
        password: password,
        hwid: hwid,
        ip: ip,
        cons: cons,
        time: time
    };

    fs.writeFile(db_file, JSON.stringify(db), (err) => {
        if (err) {
            return false;
        }
    });

    return true;
}

function GetUser(username) {
    const db = GetDatabase();
    if (typeof db === 'number') {
        return false;
    }

    if (!UserExists(username)) {
        return false;
    }

    return db.users[username];
}

function AuthUser(username, password, hwid, ip) {
    if (!UserExists(username)) {
        return false;
    }

    const user = GetUser(username);
    if (user === false) {
        return false;
    }

    return user.password === password && user.hwid === hwid && user.ip === ip;
}

function GetAdminDb() {
    try {
        const data   = fs.readFileSync(admin_file, 'utf8');
        const admins = data.split('\n');
        return admins;
    } catch (err) {
        console.error('Error reading file:', err);
        return -1;
    }
}

function IsAdmin(key) {
    const admins = GetAdminDb();
    if (admins === -1) {
        return false;
    }
    return admins.includes(key);
}

function AddAdmin(key) {
    const admins = GetAdminDb();
    if (admins === -1) {
        return false;
    }

    if (IsAdmin(key)) {
        return false;
    }

    admins.push(key);

    fs.writeFile(admin_file, admins.join('\n'), (err) => {
        if (err) {
            return false;
        }
    });

    return true;
}

module.exports = {
    GetDatabase,
    UserExists,
    AddUser,
    RemoveUser,
    UpdateUser,
    GetUser,
    AuthUser,
    GetAdminDb,
    IsAdmin,
    AddAdmin
};