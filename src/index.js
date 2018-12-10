import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
      const winningSquareStyle = {
          backgroundColor: 'yellow'
      };

      return (
          <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
          {props.value}
          </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) { 
      let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
      return (
        <Square 
          squareBackground={this.props.winningSquares}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          winningSquare={winningSquare}
        />
      );
    }

    renderRow(i) {
        let row = [];
        for ( let j = i; j <= (i + 2); j++ ) {
            row.push( this.renderSquare(j) );
        }
        return (
          <div className="board-row">
            {row}
          </div>
        );
    }
  
    render() {
      let grid = [];
      for (let i = 0; i <= 6; i += 3) {
          grid.push( this.renderRow(i) );
      }
      return (
        <div>
          {grid}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: new Array(2),
            }],
            stepNumber: 0,
            xIsNext: true,
            ascending: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);

        if ( winner || squares[i] ) {
            return;
        } 
        
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
              squares: squares,
              location: calculateLocation(i),
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    changeSort() {
        this.setState({
            ascending: !this.state.ascending,
        });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const stepNumber = this.state.stepNumber;
      const ascending = this.state.ascending;

      const moves = history.map((step, move) => {
        if (!ascending) {
            move = (history.length - move - 1);
        }
        const desc = move ?
          (move === stepNumber ?
          <b> Go to move # {move} </b> :
          'Go to move #' + move) :
          'Go to game start';
        const coordinates = move ? 
          'located at ' + history[move].location[0] + ',' + history[move].location[1] :
          null;
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc} {coordinates}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner.winner;
      } else if (history.length === 10) {
        status = 'That\'s a draw!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
      }

      let sort;
      if (this.state.ascending) {
          sort = 'Sort by descending';
      } else {
          sort = 'Sort by ascending';
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winner={winner && winner.winningSquares}
            />
          </div>
          <div className="game-info">
            <div>{status}</div><br/>
            <button onClick={() => this.changeSort()}>{sort}</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
      const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
      ]
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return {
                  winner: squares[a],
                  winningSquares: lines[i],
              }
          }
      }
      return null;
  }

  function calculateLocation(i) {
      let col;
      if (i % 3 === 0) { 
          col = 1 
      } else if (i % 3 === 1) { 
          col = 2 
      } else { 
        col = 3 
      }

      let row;
      if (i >= 0 && i <= 2) {
          row = 1
      } else if (i >= 3 && i <= 5) {
          row = 2
      } else {
          row = 3
      }

      return [col, row]
  }
  