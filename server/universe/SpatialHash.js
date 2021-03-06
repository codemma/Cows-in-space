export default
class SpatialHash {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.hash = {};
    }

    cellBounds(x, y) {
        return {
            left: x * this.cellSize,
            right: x * this.cellSize + this.cellSize,
            top: y * this.cellSize,
            bottom: y * this.cellSize + this.cellSize
        };
    }

    /**
     * Add object to spatial hash.
     * @param obj
     * @param bounds
     */
    add(obj, bounds) {
        const keys = this._keys(bounds);
        for (let key of keys) {
            // console.log('adding object id ' + obj.id + ' to key: ' + key);
            if (!(key in this.hash)) {
                this.hash[key] = [obj];
            } else {
                this.hash[key].push(obj);
            }
        }
    }

    /**
     * Update object position in hash.
     * @param obj
     * @param oldBounds
     * @param bounds
     */
    update(obj, oldBounds, bounds) {
        this.remove(obj, oldBounds);
        this.add(obj, bounds);
    }

    /**
     * Remove object from hash.
     * @param obj
     * @param bounds
     */
    remove(obj, bounds) {
        let keys = this._keys(bounds);
        for (let key of keys) {
            let index = this.hash[key].indexOf(obj);
            if (index != -1) {
                // console.log('removing object ' + obj.id + ' from key: ' + key);
                this.hash[key].splice(index, 1);
            }
        }
    }

    /**
     * Get objects in bounds with an optional filter.
     * @param bounds Bounds to search for objects
     * @param f Filter function, return true to include in result
     * @returns Array of objects matching query
     */
    query(bounds, f=null) {
        let results = [];
        let ids = {};
        let keys = this._keys(bounds);
        for (let key of keys) {
            // Filter results
            let objs = this.hash[key];

            if (objs != undefined) {
                for (let obj of objs) {
                    if (f != null) {
                        if (f(obj) && !(obj.id in ids)) {
                            results.push(obj);
                            ids[obj.id] = obj;
                        }
                    } else {
                        if (!(obj.id in ids)) {
                            results.push(obj);
                            ids[obj.id] = obj;
                        }
                    }
                }
            }
        }
        return results;
    }

    /**
     * Returns true if bounds contain any objects.
     * @param bounds
     */
    any(bounds) {
        let keys = this._keys(bounds);
        for (let key of keys) {
            if (this.hash[key].length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Count number of objects with an optional bounds.
     * @param bounds Optional bounds to search in
     * @returns Number of objects
     */
    count(bounds=null) {
        let objects = [];

        let keys;
        if (bounds) {
            keys = this._keys(bounds);
        } else {
            keys = Object.keys(this.hash);
        }

        for (let key of keys) {
            for (let obj of this.hash[key]) {
                if (!objects.includes(obj)) {
                    objects.push(obj);
                }
            }
        }
        return objects.length;
    }

    /**
     * Get array of keys the bounds intersect with.
     */
    _keys(bounds) {
        const x1 = Math.floor(bounds.x / this.cellSize)
        const x2 = Math.floor((bounds.x + bounds.width) / this.cellSize)
        const y1 = Math.floor(bounds.y / this.cellSize)
        const y2 = Math.floor((bounds.y + bounds.height) / this.cellSize)

        let keys = [];
        for (let i = x1; i <= x2; i++) {
            for (let j = y1; j <= y2; j++) {
                keys.push(i + '_' + j);
            }
        }
        return keys;
    }
}

function test() {
    let obj1 = {
        id: 1,
        type: 'player'
    };
    let bounds1 = {
        x: 0,
        y: 0,
        width: 50,
        height: 50
    };

    let hash = new SpatialHash(100);

    console.log('Object count: ' + hash.count());

    hash.add(obj1, bounds1);

    console.log('Object count: ' + hash.count());

    hash.remove(obj1, bounds1);

    console.log('Object count: ' + hash.count());

    let newBounds = {
        x: 90,
        y: 90,
        width: 50,
        height: 50
    };

    hash.update(obj1, bounds1, newBounds);

    console.log('Object count: ' + hash.count());
    console.log('Has objects in bounds? ' + hash.any(newBounds));
    console.log('Query results for "player": ' + hash.query(newBounds, (o) => o.type == 'player').length);
    console.log('Query results for "cow": ' + hash.query(newBounds, (o) => o.type == 'cow').length);
    console.log('Query results for "player" (large bounds): ' + hash.query(
        {x: -1000, y: -1000, width: 2000, height: 2000},
        (o) => o.type == 'player').length
    );

    hash.remove(obj1, newBounds);

    console.log('Has objects in bounds? ' + hash.any(newBounds));
}

// test();