# Copyright 2025 Kriko-AI
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Ki-Cypher Bowling Model:
The Ki-Cypher model is an AI-driven cricket bowling simulator designed to challenge users in a virtual cricket game.
It analyzes the user's batting patterns and adapts its bowling strategy dynamically using predefined patterns and
statistical analysis. The model aims to simulate a competitive and engaging cricket experience.
"""

import numpy as np
import random

def cypher(target=67, wickets=2):
    user_score = 0
    user_data = []   # Stores user batting moves
    cyp_data = []    # Stores AI bowling pattern
    pattern_index = 0

    print("🎳 Hii, Am the new Kriko Cypher Model, Do batting with cautions.")

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

        # Test - 01
        def patterns(user_data):
            for i in range(len(user_data) - 1):
                if user_data[i] in [4, 2, 6]:
                    return [4, 2, 6]
            return None

        # Test - 02
        def patterns_2(user_data):
            for i in range(len(user_data) - 1):
                if user_data[i] in [1, 3, 5]:
                    return [1, 3, 5]
            return None

        # Test - 03
        def patterns_3(user_data):
            for i in range(len(user_data) - 1):
                if user_data[i] in [2, 5, 1]:
                    return [2, 5, 1]
            return None

        # AI bowling logic
        pattern = patterns(user_data)
        pattern_2 = patterns_2(user_data)
        pattern_3 = patterns_3(user_data)

        if pattern:
            ai_bowl = pattern[pattern_index]
            pattern_index = (pattern_index + 1) % len(pattern)
        elif pattern_2:
            ai_bowl = pattern_2[pattern_index]
            pattern_index = (pattern_index + 1) % len(pattern_2)
        elif pattern_3:
            ai_bowl = pattern_3[pattern_index]
            pattern_index = (pattern_index + 1) % len(pattern_3)
        else:
            moves = np.bincount(user_data, minlength=7)
            most_frequent_bowl = np.argmax(moves[1:]) + 1
            safe_moves = [m for m in range(1, 7) if m != most_frequent_bowl]
            ai_bowl = random.choice(safe_moves)

        cyp_data.append(ai_bowl)

        print(f"🎯 Cypher Bowled: {ai_bowl}")

        if user_move == ai_bowl:
            wickets -= 1
            print(f"❌ OUT! You lost a wicket. Wickets left: {wickets}")
        else:
            user_score += user_move
            print(f"🏏 You Scored: {user_move} | Total: {user_score}/{target}")

    if user_score >= target:
        print("🎉 You won the match!")
    else:
        print("🤖 Cypher won! You couldn't chase the target.")

cypher()
