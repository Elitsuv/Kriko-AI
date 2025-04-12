import time
import subprocess
import numpy as np

execution_times = []

# Run the ki-d1 model multiple times for benchmarking
for i in range(5):
    print(f"⏳ Running benchmark iteration {i + 1}...")
    start = time.time()
    subprocess.run(["python", "kriko-ai/models/ki-cypher.py"], check=True)
    end = time.time()
    duration = end - start
    execution_times.append(duration)

times = np.array(execution_times)

# Print benchmark results
print("\n📊 Benchmark Results for ki-d1 Model:")
print(f"🔥 Mean Execution Time: {np.mean(times):.2f} seconds")
print(f"🚀 Fastest Execution Time: {np.min(times):.2f} seconds")
print(f"🐢 Slowest Execution Time: {np.max(times):.2f} seconds")
print(f"📏 Standard Deviation: {np.std(times):.2f} seconds")