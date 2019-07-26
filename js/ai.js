const [ NORTH, EAST, SOUTH, WEST ] = Array(4).keys()

let Context = {};

// context.size: the size of the map (max 250)
// context.count: the amount of players in the game
// context.index: your personal index
// context.rand: a seeded random function
exports.buildContext = context => {

  const grid = [];

  for(x = 0; x < context.size; x++)
  {
    grid[x] = [];

    for(y = 0; y < context.size; y++)
    {
      grid[x][y] = false;
    }
  }

  // prepare you context here

  Context = { ...context, grid };

  return {
    size : context.size,
    count : context.count,
    index : context.index,
  }
}

const wait = t => new Promise(s => setTimeout(s, t))
// context: contain everything you returned in buildContext
// players: the list of the players coordinate, you are the first in the list

exports.ai = async (context, players) => {
  // Return a direction here, choose wisely

  let { x, y } = players[0];

  for(i = 0; i < players.length; i++)
  {
    if(players[i].x < 0 || players[i].x > Context.size)
      continue;

    if(players[i].y < 0 || players[i].y > Context.size)
      continue;

    Context.grid[players[i].x][players[i].y] = true;
  }

  let weigthW = FindWeight(Context.size, Context.grid, x, y, { x: -1, y: 0 });
  let weigthE = FindWeight(Context.size, Context.grid, x, y, { x: 1, y: 0 });
  let weigthN = FindWeight(Context.size, Context.grid, x, y, { x: 0, y: -1 });
  let weigthS = FindWeight(Context.size, Context.grid, x, y, { x: 0, y: 1 });

  console.log("W " + weigthW + " E " + weigthE + " N "+ weigthN + " S " + weigthS );

  if(weigthW >= weigthE && weigthW >= weigthN && weigthW >= weigthS)
    return WEST;

  if(weigthE >= weigthW && weigthE >= weigthN && weigthE >= weigthS)
    return EAST;

  if(weigthN >= weigthW && weigthN >= weigthE && weigthN >= weigthS)
    return NORTH;

  if(weigthS >= weigthN && weigthS >= weigthE && weigthS >= weigthW)
    return SOUTH;

  // always EAST, always right
  //await wait(Math.random()*1000)
  return EAST
}

const FindWeight = (size, grid, x, y, vector) => {
  let weight = 0;

  let xToTest = x + vector.x;
  let yToTest = y + vector.y;

  while(xToTest >= 0 && xToTest < size && yToTest >= 0 && yToTest < size && grid[xToTest][yToTest] == false)
  {
    weight++;
    xToTest += vector.x;
    yToTest += vector.y;
  }

  return weight;
}

exports.name = 'CodingMojo'
