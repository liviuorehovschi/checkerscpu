from flask import Flask, render_template, request, jsonify
from checkers import CheckersBoard
from cpu import CPUPlayer

# Initialize Flask app and create a new Checkers game instance
app = Flask(__name__)
game = CheckersBoard()

@app.route('/')
def index():
    """
    Route to serve the main page of the Checkers game.

    Renders the index.html template with the current state of the game board
    and the current player.
    """
    return render_template('index.html', board=game.board, current_player=game.current_player)

@app.route('/move', methods=['POST'])
def move():
    """
    Route to handle player moves.

    Receives the move as JSON data, processes the move, and updates the game state.
    If the move is valid and it's the CPU's turn, it triggers the CPU to make its move.
    """
    data = request.json
    start = tuple(data['start'])
    end = tuple(data['end'])

    valid_move, next_player, continue_turn, mandatory_capture = game.move_piece(start, end)

    if valid_move:
        # Check if the game is over or if the next player (CPU) can move
        if not game.is_game_over() and game.current_player == 'B':
            cpu_player_turn()

    return generate_response(valid_move, continue_turn, mandatory_capture)

def cpu_player_turn():
    """
    Handles the CPU player's turn.

    Continues to make moves for the CPU player as long as it's the CPU's turn
    and there are valid moves available.
    """
    while game.current_player == 'B' and game.has_valid_moves('B'):
        cpu_player = CPUPlayer(game, 'B')
        cpu_move_start, cpu_move_end = cpu_player.choose_move()
        if cpu_move_start and cpu_move_end:
            game.move_piece(cpu_move_start, cpu_move_end)
        else:
            break  # Exit the loop if no valid CPU move is found

def generate_response(valid_move, continue_turn, mandatory_capture):
    """
    Generates a JSON response to be sent back to the client.

    Includes information about the validity of the move, the game state, 
    and whether the game is over.

    Returns:
        jsonify: A Flask JSON response containing game state information.
    """
    game_over = game.is_game_over()
    winner = None
    no_legal_moves = False

    if game_over:
        # Determine the winner based on remaining pieces and valid moves
        winner = 'R' if not game.has_pieces('B') or not game.has_valid_moves('B') else 'B'
        no_legal_moves = not game.has_valid_moves(winner)

    return jsonify({
        'valid': valid_move,
        'board': game.board,
        'current_player': game.current_player,
        'continue_turn': continue_turn and not game_over,
        'mandatory_capture': mandatory_capture,
        'game_over': game_over,
        'winner': winner,
        'no_legal_moves': no_legal_moves
    })

@app.route('/reset', methods=['GET'])
def reset_game():
    """
    Route to reset the game to its initial state.

    Re-initializes the game board and returns a success response.
    """
    global game
    game = CheckersBoard()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
