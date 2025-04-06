import time
import subprocess
import numpy as np

store = []

for i in range(5):
    start = time.time()
    subprocess.run(["python", "kriko-ai/train.py"], check=True)
    end = time.time()
    duration = end - start
    store.append(duration)
    
# Storing in NP arr for further analysis
times = np.array(store)
print(times)

print("🔥 Mean:", np.mean(times))
print("🚀 Fastest:", np.min(times))
print("🐢 Slowest:", np.max(times))
print("📏 Std Dev:", np.std(times))