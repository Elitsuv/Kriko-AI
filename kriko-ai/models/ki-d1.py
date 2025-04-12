import numpy as np
import random


def play_batting(target=45, wickets=2):
    ai_score = 0
    user_data = []  # Stores user bowls
    ai_data = []    # Stores AI bats
    
    print("🏏 Welcome to Kriko AI Batting Mode! AI will try to chase the target.")
    
    while wickets > 0 and ai_score < target:
        try:
            user_bowl = int(input("🎯 Enter your bowl (1-6): "))
            if user_bowl < 1 or user_bowl > 6:
                print("❌ Invalid bowl! Choose between 1 and 6.")
                continue
        except ValueError:
            print("❌ Enter a valid number!")
            continue

        user_data.append(user_bowl)

        if len(user_data) > 3:
            moves = np.bincount(user_data, minlength=7)
            most_frequent_bowl = np.argmax(moves[1:]) + 1
            safe_moves = [m for m in range(1, 7) if m != most_frequent_bowl]
            ai_bat = random.choice(safe_moves)
        else:
            ai_bat = random.randint(1, 6)

        ai_data.append(ai_bat)
        print(f"🤖 AI Bat: {ai_bat}")

        if ai_bat == user_bowl:
            wickets -= 1
            print(f"❌ OUT! AI lost a wicket. Wickets left: {wickets}")
        else:
            ai_score += ai_bat
            print(f"🏏 AI Scored: {ai_bat} | Total Score: {ai_score}/{target}")

    if ai_score >= target:
        print("🎉 AI won the match!")
    else:
        print("🏆 You won! AI couldn't chase the target.")

def play_bowling(target=45, wickets=2):
    user_score = 0
    user_data = []  # Stores user bats
    ai_data = []    # Stores AI bowls
    
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

        user_data.append(user_move)

        if len(user_data) > 3:
            moves = np.bincount(user_data, minlength=7)
            ai_bowl = np.argmax(moves[1:]) + 1
        else:
            ai_bowl = random.randint(1, 6)

        ai_data.append(ai_bowl)
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


if __name__ == "__main__":
    play_batting()
    play_bowling()