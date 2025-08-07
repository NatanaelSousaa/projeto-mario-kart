const players = [
  {
    name: "Mario",
    velocity: 4,
    maneuverability: 3,
    power: 3,
    points: 0,
  },
  {
    name: "Luigi",
    velocity: 3,
    maneuverability: 4,
    power: 4,
    points: 0,
  },
  {
    name: "Thomas",
    velocity: 3,
    maneuverability: 4,
    power: 4,
    points: 0,
  },
];

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;
    default:
      result = "CONFRONTO";
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `🎲 ${characterName} rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
}

async function playRaceEngine(players, totalRounds) {
  for (let round = 1; round <= totalRounds; round++) {
    console.log(`\n🏁 Rodada ${round}`);

    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    // Cria um array para armazenar os resultados de cada jogador
    const roundResults = [];

    for (const player of players) {
      const diceResult = await rollDice();
      let totalTestSkill = 0;
      let attributeName = "";

      if (block === "RETA") {
        totalTestSkill = diceResult + player.velocity;
        attributeName = "velocidade";
      } else if (block === "CURVA") {
        totalTestSkill = diceResult + player.maneuverability;
        attributeName = "manobrabilidade";
      } else if (block === "CONFRONTO") {
        totalTestSkill = diceResult + player.power;
        attributeName = "poder";
      }
      
      await logRollResult(player.name, attributeName, diceResult, player[attributeName]);
      roundResults.push({ player, totalTestSkill });
    }

    // Lógica para confronto (se houver)
    if (block === "CONFRONTO") {
      const sortedResults = [...roundResults].sort((a, b) => b.totalTestSkill - a.totalTestSkill);
      const winner = sortedResults[0];
      const loser = sortedResults[1];

      if (winner && loser && winner.totalTestSkill > loser.totalTestSkill) {
        if (loser.player.points > 0) {
          console.log(`\n🥊 ${winner.player.name} venceu o confronto contra ${loser.player.name}! ${loser.player.name} perdeu 1 ponto 🐢`);
          loser.player.points--;
        } else {
          console.log(`\n🥊 ${winner.player.name} venceu o confronto contra ${loser.player.name}, mas ${loser.player.name} não tinha pontos a perder.`);
        }
      } else {
        console.log("Confronto empatado! Nenhum ponto foi perdido.");
      }
    }

    // Verificando o vencedor da rodada (fora do confronto)
    if (block !== "CONFRONTO") {
      const sortedResults = [...roundResults].sort((a, b) => b.totalTestSkill - a.totalTestSkill);
      const winner = sortedResults[0];
      const second = sortedResults[1];

      if (winner && second && winner.totalTestSkill > second.totalTestSkill) {
        console.log(`\n🏆 ${winner.player.name} marcou um ponto!`);
        winner.player.points++;
      } else {
        console.log("\nEmpate na rodada! Nenhum ponto foi marcado.");
      }
    }

    console.log("-----------------------------");
  }
}

async function declareWinner(players) {
  console.log("\n🏁 Resultado final:");

  players.sort((a, b) => b.points - a.points);
  
  players.forEach(player => {
    console.log(`${player.name}: ${player.points} ponto(s)`);
  });

  const winner = players[0];
  const secondPlace = players[1];

  if (winner.points > 0 && winner.points > secondPlace.points) {
    console.log(`\n🎉 ${winner.name} venceu a corrida! Parabéns! 🏆`);
  } else if (winner.points === secondPlace.points) {
    console.log("\n🤝 A corrida terminou em empate!");
  } else {
    console.log("\nA corrida terminou sem um vencedor claro.");
  }
}

(async function main() {
  const racingPlayers = [players[0], players[1], players[2]]; // Adicione ou remova jogadores aqui
  const totalRounds = 5;
  const playerNames = racingPlayers.map(p => p.name).join(' e ');

  console.log(
    `🏁🚨 Corrida entre ${playerNames} começando...\n`
  );

  await playRaceEngine(racingPlayers, totalRounds);
  await declareWinner(racingPlayers);
})();