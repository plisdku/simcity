export default {
  residential: () => {
    return {
      id: "residential",
      height: 1,
      updated: true,
      update: function() {
        const r = Math.random();
        if (r < 1e-2) {
          this.height++;
          this.updated = true;
        } else if (r < 1.5e-2) {
          this.height = Math.max(1, this.height - 1);
          this.updated = true;
        }
      },
    };
  },
  commercial: () => {
    return {
      id: "commercial",
      height: 1,
      updated: true,
      update: function() {
        const r = Math.random();
        if (r < 1e-2) {
          this.height++;
          this.updated = true;
        } else if (r < 1.5e-2) {
          this.height = Math.max(1, this.height - 1);
          this.updated = true;
        }
      },
    };
  },
  industrial: () => {
    return {
      id: "industrial",
      height: 1,
      updated: true,
      update:function() {
        const r = Math.random();
        if (r < 1e-2) {
          this.height++;
          this.updated = true;
        } else if (r < 1.5e-2) {
          this.height = Math.max(1, this.height - 1);
          this.updated = true;
        }
      },
    };
  },
  road: () => {
    return {
      id: "road",
      updated: true,
      height: 0.1,
      update: function() {},
    };
  },
};
