import numpy as np
import csv

player_moves = []
ai_moves = []

with open('kriko-ai/data/moves.csv', 'r') as file:
    reader = csv.DictReader(file)
    print("Headers:", reader.fieldnames)  # Show the column names
    for i, row in enumerate(reader):
        print("Row", i, ":", row)
        if i >= 100:
            break

# analysis of opponent prediction

sample = {1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
for i in range(len(player_moves) - 1):
    current_move = player_moves[i]
    next_move = ai_moves[i + 1]
    sample[current_move].append(next_move)

print("Sample moves: ", sample)

def guess(new_moves):
    ai_new_moves = sample.get(new_moves)
    if not ai_new_moves:
        return np.random.randint(6)
    
    unique_moves, counts = np.unique(ai_new_moves, return_counts=True)
    most_common_index = np.argmax(counts)  # Index of highest count
    return unique_moves[most_common_index]

print("If AI play 3, they might play:", guess(3))
print("If AI play 4, they might play:", guess(4))