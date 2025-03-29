import numpy as np
import random

def play_bowling(target=45, wickets=2):
    user_score = 0
    ai_data = []

    print("🎳 Welcome to Kriko AI Bowling Mode! Try to chase the target.")

    while wickets > 0 and user_score < target:
        try:
            user_move = int(input("🏏 Enter your batting move (1-6): "))
            if user_move < 1 or user_move > 6:
                print("❌ Invalid move! Choose between 1 and 6.")
                continue
        except ValueError:
            print("❌ Enter a valid number!")
            continue

        ai_data.append(user_move)

        if len(ai_data) > 3:
            moves = np.bincount(ai_data, minlength=7)
            ai_bowl = np.argmax(moves[1:]) + 1
        else:
            ai_bowl = random.randint(1, 6)

        print(f"🤖 AI Bowls: {ai_bowl}")

        if ai_bowl == user_move:
            wickets -= 1
            print(f"❌ OUT! You lost a wicket. Wickets left: {wickets}")
        else:
            user_score += user_move
            print(f"🏏 You Scored: {user_move} | Total Score: {user_score}/{target}")

    if user_score >= target:
        print("🎉 You won the match!")
    else:
        print("🏆 AI won! You couldn't chase the target.")

        return ()
if __name__ == "__main__":
    play_bowling()