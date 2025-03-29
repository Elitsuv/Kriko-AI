import numpy as np
import random

def play_batting(target=45, wickets=2):
    ai_score = 0
    data = []

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

        data.append(user_bowl)

        if len(data) > 3:
            moves = np.bincount(data, minlength=7)
            most_frequent_bowl = np.argmax(moves[1:]) + 1
            safe_moves = [m for m in range(1, 7) if m != most_frequent_bowl]
            ai_bat = random.choice(safe_moves)
        else:
            ai_bat = random.randint(1, 6)

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

    return ()
if __name__ == "__main__":
    play_batting()