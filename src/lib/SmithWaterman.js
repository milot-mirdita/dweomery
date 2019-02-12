export default function (a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    // swap to save some memory O(min(a,b)) instead of O(a)
    if (a.length > b.length) {
        var tmp = a;
        a = b;
        b = tmp;
    }

    var row = Array(a.length + 1);
    // init the row
    for (var i = 0; i <= a.length; i++) {
        row[i] = 0;
    }

    // fill in the rest
    for (var i = 1; i <= b.length; i++) {
        var prev = 0;
        for (var j = 1; j <= a.length; j++) {
            var val;
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                val = row[j - 1] + 3; // match
            } else {
                val = Math.max(0,
                    Math.max(row[j - 1] - 1,  // substitution
                        Math.max(prev - 1,      // insertion
                            row[j] - 1)));  // deletion
            }
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }
    return Math.max(...row);
}
