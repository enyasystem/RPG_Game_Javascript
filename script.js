let xp = 0;
        let health = 300;
        let gold = 150;
        let currentWeapon = 0;
        let fighting;
        let monsterHealth;
        let inventory = ["stick"];

        const button1 = document.querySelector("#button1");
        const button2 = document.querySelector("#button2");
        const button3 = document.querySelector("#button3");
        const text = document.querySelector("#text");
        const xpText = document.querySelector("#xpText");
        const healthText = document.querySelector("#healthText");
        const goldText = document.querySelector("#goldText");
        const monsterStats = document.querySelector("#monsterStats");
        const monsterNameText = document.querySelector("#monsterName");
        const monsterHealthText = document.querySelector("#monsterHealth");

        // Initialize stats display
        xpText.innerText = xp;
        healthText.innerText = health;
        goldText.innerText = gold;

        const weapons = [
            { name: "stick", power: 5 },
            { name: "dagger", power: 30 },
            { name: "claw hammer", power: 50 },
            { name: "sword", power: 100 }
        ];

        const monsters = [
            { name: "slime", level: 2, health: 15 },
            { name: "fanged beast", level: 8, health: 60 },
            { name: "dragon", level: 20, health: 300 }
        ];

        const locations = [
            {
                name: "town square",
                "button text": ["Go to store", "Go to cave", "Fight dragon"],
                "button functions": [goStore, goCave, fightDragon],
                text: "You are in the town square. You see a sign that says 'store'."
            },
            {
                name: "store",
                "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
                "button functions": [buyHealth, buyWeapon, goTown],
                text: "You enter the store."
            },
            {
                name: "cave",
                "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
                "button functions": [fightSlime, fightBeast, goTown],
                text: "You enter the cave. You see some monsters."
            },
            {
                name: "fight",
                "button text": ["Attack", "Dodge", "Run"],
                "button functions": [attack, dodge, goTown],
                text: "You are fighting a monster."
            },
            {
                name: "kill monster",
                "button text": ["Go to town square", "Go to town square", "Go to town square"],
                "button functions": [goTown, goTown, goTown],
                text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
            },
            {
                name: "lose",
                "button text": ["REPLAY?", "REPLAY", "REPLAY"],
                "button functions": [restart, restart, restart],
                text: "You die."
            },
            {
                name: "win",
                "button text": ["REPLAY?", "REPLAY", "REPLAY"],
                "button functions": [restart, restart, restart],
                text: "You defeat the dragon! YOU WIN THE GAME!"
            }
        ];

        // Initialize buttons
        button1.onclick = goStore;
        button2.onclick = goCave;
        button3.onclick = fightDragon;

        function update(location) {
            monsterStats.style.display = "none";
            button1.innerText = location["button text"][0];
            button2.innerText = location["button text"][1];
            button3.innerText = location["button text"][2];
            button1.onclick = location["button functions"][0];
            button2.onclick = location["button functions"][1];
            button3.onclick = location["button functions"][2];
            text.innerText = location.text;
        }

        function goTown() {
            update(locations[0]);
        }

        function goStore() {
            update(locations[1]);
        }

        function goCave() {
            update(locations[2]);
        }

        function buyHealth() {
            if (gold >= 10) {
                gold -= 10;
                health += 10;
                goldText.innerText = gold;
                healthText.innerText = health;
                updateHealthBar(health, 'playerHealthBar');
            } else {
                text.innerText = "You do not have enough gold to buy health.";
            }
        }

        function buyWeapon() {
            if (currentWeapon < weapons.length - 1) {
                if (gold >= 30) {
                    gold -= 30;
                    currentWeapon++;
                    const newWeapon = weapons[currentWeapon].name;
                    goldText.innerText = gold;
                    text.innerText = `You now have a ${newWeapon}.`;
                    inventory.push(newWeapon);
                    text.innerText += ` In your inventory you have: ${inventory.join(", ")}.`;
                } else {
                    text.innerText = "You do not have enough gold to buy a weapon.";
                }
            } else {
                text.innerText = "You already have the most powerful weapon!";
                button2.innerText = "Sell weapon for 15 gold";
                button2.onclick = sellWeapon;
            }
        }

        function sellWeapon() {
            if (inventory.length > 1) {
                const soldWeapon = inventory.shift();
                gold += 15;
                goldText.innerText = gold;
                text.innerText = `You sold a ${soldWeapon}. In your inventory you have: ${inventory.join(", ")}.`;
            } else {
                text.innerText = "Don't sell your only weapon!";
            }
        }

        function fightSlime() {
            fighting = 0;
            goFight();
        }

        function fightBeast() {
            fighting = 1;
            goFight();
        }

        function fightDragon() {
            fighting = 2;
            goFight();
        }

        function goFight() {
            update(locations[3]);
            monsterHealth = monsters[fighting].health;
            monsterStats.style.display = "block";
            monsterNameText.innerText = monsters[fighting].name;
            monsterHealthText.innerText = monsterHealth;
            updateHealthBar(monsterHealth, 'monsterHealthBar');
        }

        function attack() {
            text.innerText = `The ${monsters[fighting].name} attacks.`;
            text.innerText += ` You attack it with your ${weapons[currentWeapon].name}.`;

            const monsterDamage = monsters[fighting].level;
            const playerDamage = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;

            health -= monsterDamage;
            monsterHealth -= playerDamage;

            healthText.innerText = health;
            monsterHealthText.innerText = monsterHealth;
            updateHealthBar(health, 'playerHealthBar');
            updateHealthBar(monsterHealth, 'monsterHealthBar');

            if (health <= 0) {
                lose();
            } else if (monsterHealth <= 0) {
                fighting === 2 ? winGame() : defeatMonster();
            }
        }

        function dodge() {
            text.innerText = `You dodge the attack from the ${monsters[fighting].name}.`;
        }

        function defeatMonster() {
            gold += Math.floor(monsters[fighting].level * 6.7);
            xp += monsters[fighting].level;
            goldText.innerText = gold;
            xpText.innerText = xp;
            update(locations[4]);
        }

        function lose() {
            update(locations[5]);
        }

        function winGame() {
            update(locations[6]);
        }

        function restart() {
            xp = 0;
            health = 100;
            gold = 50;
            currentWeapon = 0;
            inventory = ["stick"];
            healthText.innerText = health;
            goldText.innerText = gold;
            xpText.innerText = xp;
            updateHealthBar(health, 'playerHealthBar');
            goTown();
        }

        function updateHealthBar(health, elementId) {
            const healthBar = document.getElementById(elementId);
            const maxHealth = elementId === 'playerHealthBar' ? 300 : monsters[fighting]?.health || 100;
            const healthPercent = Math.max(0, (health / maxHealth) * 100);
            healthBar.style.width = `${healthPercent}%`;
            healthBar.textContent = `Health: ${health}`;
        }
