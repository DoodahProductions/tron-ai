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

  const { x, y } = players[0];

  for(i = 0; i < players.length; i++)
  {
    Context.grid[players[i].x][players[i].y] = true;
  }



  if(x - 1 >= 0 && Context.grid[x - 1][y] == false)
  {
    console.log(Context.grid[x - 1][y]);
    console.log("WEST");
    return WEST;
  }

  if(x + 1 < context.size && Context.grid[x + 1][y] == false)
  {
    console.log(Context.grid[x + 1][y]);
    console.log("EAST");
    return EAST;
  }

  if(y + 1 >= 0 && Context.grid[x][y + 1] == false)
  {
    console.log(Context.grid[x][y + 1]);
    console.log("SOUTH");
    return SOUTH;
  }

  if(y - 1 < context.size && Context.grid[x][y - 1] == false)
  {
    console.log(Context.grid[x][y + 1]);
    console.log("NORTH");
    return NORTH;
  }

  // always EAST, always right
  //await wait(Math.random()*1000)
  return EAST
}

exports.name = 'CodingMojo'
