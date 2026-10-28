/**
 * ============================================================================
 *  Algorithm Explorer  —  a menu-driven C++17 console application
 * ============================================================================
 *
 *  Featured project of the portfolio website (see index.html -> Projects).
 *  This file is a standalone program. It is NOT executed in the browser; the
 *  website only lets visitors view or download this source file.
 *
 *  What it demonstrates
 *  --------------------
 *    1. Binary search (iterative) with a step-by-step trace
 *    2. Sorting algorithm comparison (bubble, insertion, merge, quick, std::sort)
 *       with comparison counts and wall-clock timings
 *    3. Graph traversal: breadth-first search (BFS) and depth-first search (DFS)
 *    4. Dijkstra's shortest path on a weighted, undirected graph
 *    5. Dynamic programming: longest common subsequence (LCS)
 *    6. Number theory: Sieve of Eratosthenes
 *
 *  Build
 *  -----
 *    g++ -std=c++17 -O2 -Wall -Wextra -pedantic portfolio.cpp -o algorithm_explorer
 *    ./algorithm_explorer
 *
 *  Design notes
 *  ------------
 *    - Every user input goes through a validating reader (readInt / readIntList)
 *      that re-prompts on bad input and exits cleanly on end-of-file.
 *    - Each algorithm lives in its own function, separate from I/O code, so it
 *      can be reused or unit-tested.
 *    - Only the C++17 standard library is used.
 * ============================================================================
 */

#include <algorithm>
#include <chrono>
#include <cstddef>
#include <cstdint>
#include <functional>
#include <iomanip>
#include <iostream>
#include <limits>
#include <optional>
#include <queue>
#include <random>
#include <sstream>
#include <stack>
#include <string>
#include <tuple>
#include <utility>
#include <vector>

namespace {

// ----------------------------------------------------------------------------
//  Input helpers
// ----------------------------------------------------------------------------

/// Thrown internally when standard input reaches end-of-file, so that the
/// program can exit gracefully instead of looping forever.
struct InputClosed {};

/// Removes leading and trailing whitespace.
std::string trim(const std::string& s) {
    const auto first = s.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) return "";
    const auto last = s.find_last_not_of(" \t\r\n");
    return s.substr(first, last - first + 1);
}

/// Reads one full line from stdin; throws InputClosed on EOF.
std::string readLine(const std::string& prompt) {
    std::cout << prompt << std::flush;
    std::string line;
    if (!std::getline(std::cin, line)) throw InputClosed{};
    return trim(line);
}

/// Parses a whole string as a long long. Returns std::nullopt if the string
/// contains anything other than a single valid integer.
std::optional<long long> parseInt(const std::string& text) {
    if (text.empty()) return std::nullopt;
    std::istringstream in(text);
    long long value = 0;
    in >> value;
    if (!in || !(in >> std::ws).eof()) return std::nullopt;
    return value;
}

/// Prompts until the user enters an integer in [lo, hi].
long long readInt(const std::string& prompt, long long lo, long long hi) {
    while (true) {
        const auto value = parseInt(readLine(prompt));
        if (value && *value >= lo && *value <= hi) return *value;
        std::cout << "  ! Please enter a whole number between " << lo
                  << " and " << hi << ".\n";
    }
}

/// Prompts until the user enters a whitespace-separated list of integers
/// whose length is in [minCount, maxCount]. Values must fit in [-1e9, 1e9].
std::vector<long long> readIntList(const std::string& prompt,
                                   std::size_t minCount, std::size_t maxCount) {
    constexpr long long kLimit = 1'000'000'000LL;
    while (true) {
        std::istringstream in(readLine(prompt));
        std::vector<long long> values;
        std::string token;
        bool ok = true;
        while (in >> token) {
            const auto v = parseInt(token);
            if (!v || *v < -kLimit || *v > kLimit) { ok = false; break; }
            values.push_back(*v);
        }
        if (ok && values.size() >= minCount && values.size() <= maxCount) return values;
        std::cout << "  ! Enter between " << minCount << " and " << maxCount
                  << " integers (each within +/-1e9), separated by spaces.\n";
    }
}

/// Prints a vector compactly, truncating long ones for readability.
void printVector(const std::vector<long long>& v, std::size_t maxShown = 20) {
    std::cout << "[";
    for (std::size_t i = 0; i < v.size() && i < maxShown; ++i) {
        if (i) std::cout << ", ";
        std::cout << v[i];
    }
    if (v.size() > maxShown) std::cout << ", ... (" << v.size() - maxShown << " more)";
    std::cout << "]";
}

void printHeader(const std::string& title) {
    std::cout << "\n" << std::string(60, '-') << "\n  " << title << "\n"
              << std::string(60, '-') << "\n";
}

// ----------------------------------------------------------------------------
//  1. Binary search
// ----------------------------------------------------------------------------

/// Iterative binary search over a sorted vector.
/// Returns the index of `target` or -1 if not present. `trace` receives each
/// (low, mid, high) window so the caller can visualise the search.
long long binarySearch(const std::vector<long long>& sorted, long long target,
                       std::vector<std::tuple<long long, long long, long long>>& trace) {
    long long low = 0;
    long long high = static_cast<long long>(sorted.size()) - 1;
    while (low <= high) {
        const long long mid = low + (high - low) / 2;   // avoids overflow
        trace.emplace_back(low, mid, high);
        const long long value = sorted[static_cast<std::size_t>(mid)];
        if (value == target) return mid;
        if (value < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

void runBinarySearch() {
    printHeader("Binary Search  -  O(log n)");
    auto data = readIntList("Enter 1-50 integers (any order): ", 1, 50);
    std::sort(data.begin(), data.end());
    std::cout << "Sorted input: ";
    printVector(data, 50);
    std::cout << "\n";
    const long long target = readInt("Value to search for: ", -1'000'000'000LL, 1'000'000'000LL);

    std::vector<std::tuple<long long, long long, long long>> trace;
    const long long index = binarySearch(data, target, trace);

    std::cout << "\nStep | low | mid | high | value at mid\n";
    for (std::size_t i = 0; i < trace.size(); ++i) {
        const auto& [lo, mid, hi] = trace[i];
        std::cout << std::setw(4) << i + 1 << " | " << std::setw(3) << lo << " | "
                  << std::setw(3) << mid << " | " << std::setw(4) << hi << " | "
                  << data[static_cast<std::size_t>(mid)] << "\n";
    }
    if (index >= 0)
        std::cout << "\nFound " << target << " at index " << index << " after "
                  << trace.size() << " step(s).\n";
    else
        std::cout << "\n" << target << " is not in the list (" << trace.size()
                  << " step(s) checked).\n";
}

// ----------------------------------------------------------------------------
//  2. Sorting algorithms
// ----------------------------------------------------------------------------

/// Statistics gathered by each sorting routine.
struct SortStats {
    std::uint64_t comparisons = 0;
    double milliseconds = 0.0;
};

void bubbleSort(std::vector<long long>& a, SortStats& s) {
    const std::size_t n = a.size();
    for (std::size_t i = 0; i + 1 < n; ++i) {
        bool swapped = false;
        for (std::size_t j = 0; j + 1 < n - i; ++j) {
            ++s.comparisons;
            if (a[j] > a[j + 1]) { std::swap(a[j], a[j + 1]); swapped = true; }
        }
        if (!swapped) break;   // already sorted: early exit
    }
}

void insertionSort(std::vector<long long>& a, SortStats& s) {
    for (std::size_t i = 1; i < a.size(); ++i) {
        const long long key = a[i];
        std::size_t j = i;
        while (j > 0) {
            ++s.comparisons;
            if (a[j - 1] <= key) break;
            a[j] = a[j - 1];
            --j;
        }
        a[j] = key;
    }
}

void mergeSortRange(std::vector<long long>& a, std::vector<long long>& buf,
                    std::size_t lo, std::size_t hi, SortStats& s) {
    if (hi - lo < 2) return;
    const std::size_t mid = lo + (hi - lo) / 2;
    mergeSortRange(a, buf, lo, mid, s);
    mergeSortRange(a, buf, mid, hi, s);
    std::size_t i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        ++s.comparisons;
        buf[k++] = (a[j] < a[i]) ? a[j++] : a[i++];   // stable merge
    }
    while (i < mid) buf[k++] = a[i++];
    while (j < hi) buf[k++] = a[j++];
    std::copy(buf.begin() + static_cast<std::ptrdiff_t>(lo),
              buf.begin() + static_cast<std::ptrdiff_t>(hi),
              a.begin() + static_cast<std::ptrdiff_t>(lo));
}

void mergeSort(std::vector<long long>& a, SortStats& s) {
    std::vector<long long> buf(a.size());
    mergeSortRange(a, buf, 0, a.size(), s);
}

/// Quick sort with median-of-three pivot and Hoare-style partitioning.
void quickSortRange(std::vector<long long>& a, long long lo, long long hi, SortStats& s) {
    while (lo < hi) {
        const long long mid = lo + (hi - lo) / 2;
        auto at = [&a](long long i) -> long long& { return a[static_cast<std::size_t>(i)]; };
        // Median-of-three makes sorted / reversed inputs behave well.
        if (at(mid) < at(lo)) std::swap(at(mid), at(lo));
        if (at(hi) < at(lo)) std::swap(at(hi), at(lo));
        if (at(hi) < at(mid)) std::swap(at(hi), at(mid));
        s.comparisons += 3;
        const long long pivot = at(mid);
        long long i = lo, j = hi;
        while (i <= j) {
            while (++s.comparisons, at(i) < pivot) ++i;
            while (++s.comparisons, at(j) > pivot) --j;
            if (i <= j) { std::swap(at(i), at(j)); ++i; --j; }
        }
        // Recurse into the smaller half; loop on the larger (bounded stack).
        if (j - lo < hi - i) { quickSortRange(a, lo, j, s); lo = i; }
        else { quickSortRange(a, i, hi, s); hi = j; }
    }
}

void quickSort(std::vector<long long>& a, SortStats& s) {
    if (!a.empty()) quickSortRange(a, 0, static_cast<long long>(a.size()) - 1, s);
}

void stdSort(std::vector<long long>& a, SortStats& s) {
    std::sort(a.begin(), a.end(), [&s](long long x, long long y) {
        ++s.comparisons;
        return x < y;
    });
}

/// Runs one algorithm on a copy of the data and records timing.
SortStats benchmark(const std::function<void(std::vector<long long>&, SortStats&)>& sorter,
                    const std::vector<long long>& input, std::vector<long long>& output) {
    SortStats stats;
    output = input;
    const auto start = std::chrono::steady_clock::now();
    sorter(output, stats);
    const auto end = std::chrono::steady_clock::now();
    stats.milliseconds = std::chrono::duration<double, std::milli>(end - start).count();
    return stats;
}

void runSorting() {
    printHeader("Sorting Algorithm Comparison");
    std::cout << "  1) Enter my own numbers\n  2) Generate random numbers\n";
    const long long mode = readInt("Choice: ", 1, 2);

    std::vector<long long> data;
    if (mode == 1) {
        data = readIntList("Enter 1-100 integers: ", 1, 100);
    } else {
        const long long n = readInt("How many numbers (10-5000)? ", 10, 5000);
        const long long seed = readInt("Random seed (0-999999, same seed = same data): ", 0, 999999);
        std::mt19937 rng(static_cast<std::mt19937::result_type>(seed));
        std::uniform_int_distribution<long long> dist(-10000, 10000);
        data.resize(static_cast<std::size_t>(n));
        for (auto& x : data) x = dist(rng);
    }
    std::cout << "Input:  ";
    printVector(data);
    std::cout << "\n\n";

    struct Entry { const char* name; const char* complexity;
                   std::function<void(std::vector<long long>&, SortStats&)> fn; };
    const std::vector<Entry> algorithms = {
        {"Bubble sort",    "O(n^2)",     bubbleSort},
        {"Insertion sort", "O(n^2)",     insertionSort},
        {"Merge sort",     "O(n log n)", mergeSort},
        {"Quick sort",     "O(n log n)", quickSort},
        {"std::sort",      "O(n log n)", stdSort},
    };

    std::vector<long long> reference = data;
    std::sort(reference.begin(), reference.end());

    std::cout << std::left << std::setw(16) << "Algorithm" << std::setw(12) << "Average"
              << std::right << std::setw(14) << "Comparisons" << std::setw(12) << "Time (ms)"
              << "  Correct\n";
    for (const auto& algo : algorithms) {
        std::vector<long long> out;
        const SortStats s = benchmark(algo.fn, data, out);
        std::cout << std::left << std::setw(16) << algo.name << std::setw(12) << algo.complexity
                  << std::right << std::setw(14) << s.comparisons << std::setw(12)
                  << std::fixed << std::setprecision(3) << s.milliseconds
                  << "  " << (out == reference ? "yes" : "NO") << "\n";
    }
    std::cout.unsetf(std::ios::fixed);
    std::cout << std::setprecision(6) << "\nSorted: ";
    printVector(reference);
    std::cout << "\n(Timings depend on your machine; comparison counts are exact.)\n";
}

// ----------------------------------------------------------------------------
//  Graph helpers shared by BFS, DFS and Dijkstra
// ----------------------------------------------------------------------------

struct Edge { int to; long long weight; };
using Graph = std::vector<std::vector<Edge>>;

/// A small built-in sample graph (7 nodes) so users can try traversals quickly.
Graph sampleGraph() {
    Graph g(7);
    auto add = [&g](int u, int v, long long w) {
        g[static_cast<std::size_t>(u)].push_back({v, w});
        g[static_cast<std::size_t>(v)].push_back({u, w});
    };
    add(0, 1, 4); add(0, 2, 1); add(2, 1, 2); add(1, 3, 5);
    add(2, 3, 8); add(3, 4, 3); add(4, 5, 1); add(3, 6, 6); add(5, 6, 2);
    return g;
}

/// Lets the user use the sample graph or type their own edge list.
Graph readGraph(bool weighted) {
    std::cout << "  1) Use the sample graph (7 nodes, 9 edges)\n  2) Enter my own graph\n";
    if (readInt("Choice: ", 1, 2) == 1) {
        std::cout << "Sample edges (u-v:w): 0-1:4 0-2:1 2-1:2 1-3:5 2-3:8 3-4:3 4-5:1 3-6:6 5-6:2\n";
        return sampleGraph();
    }
    const int n = static_cast<int>(readInt("Number of nodes (2-50): ", 2, 50));
    const int m = static_cast<int>(readInt("Number of edges (1-200): ", 1, 200));
    Graph g(static_cast<std::size_t>(n));
    for (int i = 0; i < m; ++i) {
        const std::string prompt = "Edge " + std::to_string(i + 1) +
            (weighted ? " as 'u v weight' (weight 0-1000000): " : " as 'u v': ");
        while (true) {
            const auto parts = readIntList(prompt, weighted ? 3 : 2, weighted ? 3 : 2);
            const long long u = parts[0], v = parts[1];
            const long long w = weighted ? parts[2] : 1;
            if (u < 0 || v < 0 || u >= n || v >= n) {
                std::cout << "  ! Nodes must be between 0 and " << n - 1 << ".\n";
                continue;
            }
            if (w < 0 || w > 1'000'000) {
                std::cout << "  ! Weight must be between 0 and 1000000.\n";
                continue;
            }
            g[static_cast<std::size_t>(u)].push_back({static_cast<int>(v), w});
            g[static_cast<std::size_t>(v)].push_back({static_cast<int>(u), w});
            break;
        }
    }
    // Sort neighbours so traversal order is deterministic and easy to follow.
    for (auto& adj : g)
        std::sort(adj.begin(), adj.end(), [](const Edge& a, const Edge& b) { return a.to < b.to; });
    return g;
}

// ----------------------------------------------------------------------------
//  3. BFS and DFS
// ----------------------------------------------------------------------------

/// Breadth-first search. Returns the visit order and fills `distance` with the
/// number of edges from `start` (-1 = unreachable).
std::vector<int> bfs(const Graph& g, int start, std::vector<int>& distance) {
    distance.assign(g.size(), -1);
    std::vector<int> order;
    std::queue<int> q;
    distance[static_cast<std::size_t>(start)] = 0;
    q.push(start);
    while (!q.empty()) {
        const int u = q.front();
        q.pop();
        order.push_back(u);
        for (const Edge& e : g[static_cast<std::size_t>(u)]) {
            if (distance[static_cast<std::size_t>(e.to)] == -1) {
                distance[static_cast<std::size_t>(e.to)] = distance[static_cast<std::size_t>(u)] + 1;
                q.push(e.to);
            }
        }
    }
    return order;
}

/// Iterative depth-first search (explicit stack, so no recursion limit).
std::vector<int> dfs(const Graph& g, int start) {
    std::vector<bool> seen(g.size(), false);
    std::vector<int> order;
    std::stack<int> st;
    st.push(start);
    while (!st.empty()) {
        const int u = st.top();
        st.pop();
        if (seen[static_cast<std::size_t>(u)]) continue;
        seen[static_cast<std::size_t>(u)] = true;
        order.push_back(u);
        // Push neighbours in reverse so the smallest id is explored first.
        const auto& adj = g[static_cast<std::size_t>(u)];
        for (auto it = adj.rbegin(); it != adj.rend(); ++it)
            if (!seen[static_cast<std::size_t>(it->to)]) st.push(it->to);
    }
    return order;
}

void printOrder(const std::string& label, const std::vector<int>& order) {
    std::cout << label;
    for (std::size_t i = 0; i < order.size(); ++i) std::cout << (i ? " -> " : "") << order[i];
    std::cout << "\n";
}

void runTraversal() {
    printHeader("Graph Traversal  -  BFS & DFS, O(V + E)");
    const Graph g = readGraph(false);
    const int n = static_cast<int>(g.size());
    const int start = static_cast<int>(readInt("Start node (0-" + std::to_string(n - 1) + "): ", 0, n - 1));

    std::vector<int> dist;
    const auto bOrder = bfs(g, start, dist);
    const auto dOrder = dfs(g, start);
    printOrder("\nBFS order: ", bOrder);
    printOrder("DFS order: ", dOrder);

    std::cout << "\nHops from node " << start << " (BFS levels):\n";
    for (int v = 0; v < n; ++v) {
        std::cout << "  node " << std::setw(2) << v << ": ";
        if (dist[static_cast<std::size_t>(v)] < 0) std::cout << "unreachable\n";
        else std::cout << dist[static_cast<std::size_t>(v)] << "\n";
    }
    std::cout << "Reachable nodes: " << bOrder.size() << " of " << n << "\n";
}

// ----------------------------------------------------------------------------
//  4. Dijkstra's shortest path
// ----------------------------------------------------------------------------

constexpr long long kInf = std::numeric_limits<long long>::max();

/// Classic Dijkstra with a binary heap: O((V + E) log V). Weights must be >= 0.
std::vector<long long> dijkstra(const Graph& g, int source, std::vector<int>& parent) {
    std::vector<long long> dist(g.size(), kInf);
    parent.assign(g.size(), -1);
    using Item = std::pair<long long, int>;               // (distance, node)
    std::priority_queue<Item, std::vector<Item>, std::greater<Item>> pq;
    dist[static_cast<std::size_t>(source)] = 0;
    pq.push({0, source});
    while (!pq.empty()) {
        const auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[static_cast<std::size_t>(u)]) continue;  // stale entry
        for (const Edge& e : g[static_cast<std::size_t>(u)]) {
            const long long nd = d + e.weight;
            if (nd < dist[static_cast<std::size_t>(e.to)]) {
                dist[static_cast<std::size_t>(e.to)] = nd;
                parent[static_cast<std::size_t>(e.to)] = u;
                pq.push({nd, e.to});
            }
        }
    }
    return dist;
}

void runDijkstra() {
    printHeader("Dijkstra's Shortest Path  -  O((V + E) log V)");
    const Graph g = readGraph(true);
    const int n = static_cast<int>(g.size());
    const int source = static_cast<int>(readInt("Source node (0-" + std::to_string(n - 1) + "): ", 0, n - 1));

    std::vector<int> parent;
    const auto dist = dijkstra(g, source, parent);

    std::cout << "\nNode | Distance | Path\n";
    for (int v = 0; v < n; ++v) {
        std::cout << std::setw(4) << v << " | ";
        if (dist[static_cast<std::size_t>(v)] == kInf) { std::cout << "     inf | (unreachable)\n"; continue; }
        std::cout << std::setw(8) << dist[static_cast<std::size_t>(v)] << " | ";
        std::vector<int> path;
        for (int cur = v; cur != -1; cur = parent[static_cast<std::size_t>(cur)]) path.push_back(cur);
        std::reverse(path.begin(), path.end());
        for (std::size_t i = 0; i < path.size(); ++i) std::cout << (i ? " -> " : "") << path[i];
        std::cout << "\n";
    }
}

// ----------------------------------------------------------------------------
//  5. Longest common subsequence (dynamic programming)
// ----------------------------------------------------------------------------

/// Bottom-up LCS in O(|a| * |b|) time and space; reconstructs one LCS string.
std::string longestCommonSubsequence(const std::string& a, const std::string& b) {
    const std::size_t n = a.size(), m = b.size();
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1, 0));
    for (std::size_t i = 1; i <= n; ++i)
        for (std::size_t j = 1; j <= m; ++j)
            dp[i][j] = (a[i - 1] == b[j - 1]) ? dp[i - 1][j - 1] + 1
                                              : std::max(dp[i - 1][j], dp[i][j - 1]);
    // Walk back through the table to rebuild the subsequence.
    std::string out;
    std::size_t i = n, j = m;
    while (i > 0 && j > 0) {
        if (a[i - 1] == b[j - 1]) { out.push_back(a[i - 1]); --i; --j; }
        else if (dp[i - 1][j] >= dp[i][j - 1]) --i;
        else --j;
    }
    std::reverse(out.begin(), out.end());
    return out;
}

std::string readNonEmpty(const std::string& prompt, std::size_t maxLen) {
    while (true) {
        const std::string s = readLine(prompt);
        if (!s.empty() && s.size() <= maxLen) return s;
        std::cout << "  ! Enter between 1 and " << maxLen << " characters.\n";
    }
}

void runLcs() {
    printHeader("Longest Common Subsequence  -  Dynamic Programming, O(n*m)");
    const std::string a = readNonEmpty("First string (1-1000 chars): ", 1000);
    const std::string b = readNonEmpty("Second string (1-1000 chars): ", 1000);
    const std::string lcs = longestCommonSubsequence(a, b);
    std::cout << "\nLCS length: " << lcs.size() << "\n";
    std::cout << "One LCS:    " << (lcs.empty() ? "(none - no common characters)" : "\"" + lcs + "\"") << "\n";
    const double similarity = 2.0 * static_cast<double>(lcs.size()) /
                              static_cast<double>(a.size() + b.size()) * 100.0;
    std::cout << "Similarity: " << std::fixed << std::setprecision(1) << similarity << "%\n";
    std::cout.unsetf(std::ios::fixed);
    std::cout << std::setprecision(6);
}

// ----------------------------------------------------------------------------
//  6. Sieve of Eratosthenes
// ----------------------------------------------------------------------------

/// Returns all primes <= limit in O(n log log n).
std::vector<long long> sieve(long long limit) {
    std::vector<bool> composite(static_cast<std::size_t>(limit + 1), false);
    std::vector<long long> primes;
    for (long long i = 2; i <= limit; ++i) {
        if (composite[static_cast<std::size_t>(i)]) continue;
        primes.push_back(i);
        for (long long j = i * i; j <= limit; j += i) composite[static_cast<std::size_t>(j)] = true;
    }
    return primes;
}

void runSieve() {
    printHeader("Sieve of Eratosthenes  -  O(n log log n)");
    const long long limit = readInt("Find all primes up to (2-10000000): ", 2, 10'000'000);
    const auto start = std::chrono::steady_clock::now();
    const auto primes = sieve(limit);
    const auto end = std::chrono::steady_clock::now();
    std::cout << "\nFound " << primes.size() << " primes <= " << limit << " in "
              << std::fixed << std::setprecision(2)
              << std::chrono::duration<double, std::milli>(end - start).count() << " ms.\n";
    std::cout.unsetf(std::ios::fixed);
    std::cout << std::setprecision(6) << "First primes: ";
    printVector(primes, 15);
    std::cout << "\nLargest prime: " << primes.back() << "\n";
}

// ----------------------------------------------------------------------------
//  Menu
// ----------------------------------------------------------------------------

void printMenu() {
    std::cout << "\n============================================================\n"
              << "                 A L G O R I T H M   E X P L O R E R\n"
              << "============================================================\n"
              << "  1) Binary search\n"
              << "  2) Sorting algorithm comparison\n"
              << "  3) Graph traversal (BFS & DFS)\n"
              << "  4) Dijkstra's shortest path\n"
              << "  5) Longest common subsequence (DP)\n"
              << "  6) Sieve of Eratosthenes (primes)\n"
              << "  0) Exit\n";
}

}  // namespace

int main() {
    std::ios::sync_with_stdio(false);
    try {
        while (true) {
            printMenu();
            switch (readInt("Select an option: ", 0, 6)) {
                case 1: runBinarySearch(); break;
                case 2: runSorting();      break;
                case 3: runTraversal();    break;
                case 4: runDijkstra();     break;
                case 5: runLcs();          break;
                case 6: runSieve();        break;
                case 0:
                    std::cout << "Goodbye - happy problem solving!\n";
                    return 0;
                default: break;
            }
        }
    } catch (const InputClosed&) {
        std::cout << "\nInput closed. Exiting Algorithm Explorer.\n";
    }
    return 0;
}
