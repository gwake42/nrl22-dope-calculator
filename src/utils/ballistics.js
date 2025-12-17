// Ballistic Calculator - Core calculations for NRL22 dope charts
export const BallisticsEngine = {
    // Constants
    GRAVITY: 32.174, // ft/s²
    
    // Calculate velocity at distance using simplified drag model
    getVelocityAtDistance(muzzleVelocity, bc, distance, atmosphericDensity) {
        // Simplified velocity decay for .22 LR
        // Using exponential decay approximation
        const dragCoefficient = 0.5 / bc;
        const distanceFeet = distance * 3; // yards to feet
        const velocityDecay = Math.exp(-dragCoefficient * atmosphericDensity * distanceFeet / 10000);
        return muzzleVelocity * velocityDecay;
    },
    
    // Calculate bullet path (drop from bore line)
    calculateBulletPath(velocity, bc, distance, temp, altitude, pressure) {
        // Atmospheric corrections
        const tempFactor = (temp + 459.67) / 518.67; // Convert to Rankine and normalize
        const altitudeFactor = Math.exp(-altitude / 30000);
        const pressureFactor = pressure / 29.92;
        const atmosphericDensity = (pressureFactor / tempFactor) * altitudeFactor;
        
        const distanceFeet = distance * 3; // Convert yards to feet
        
        // Calculate time of flight using average velocity
        const velocityAtTarget = this.getVelocityAtDistance(velocity, bc, distance, atmosphericDensity);
        const avgVelocity = (velocity + velocityAtTarget) / 2;
        const timeOfFlight = distanceFeet / avgVelocity;
        
        // Bullet drop from bore line (gravity effect)
        const dropFeet = 0.5 * this.GRAVITY * timeOfFlight * timeOfFlight;
        const dropInches = dropFeet * 12;
        
        return dropInches;
    },
    
    // Calculate line of sight angle needed to zero at given distance
    calculateZeroAngle(velocity, bc, zeroDistance, sightHeight, temp, altitude, pressure) {
        // Get bullet drop at zero distance
        const bulletDrop = this.calculateBulletPath(velocity, bc, zeroDistance, temp, altitude, pressure);
        
        // Line of sight must angle up to compensate for sight height and bullet drop
        const zeroDistanceInches = zeroDistance * 36; // yards to inches
        const angleRadians = Math.atan((sightHeight + bulletDrop) / zeroDistanceInches);
        
        return angleRadians;
    },
    
    // Calculate bullet position relative to line of sight at any distance
    calculateDrop(velocity, bc, distance, zeroDistance, sightHeight, temp, altitude, pressure) {
        // Get the zero angle (scope cant/angle)
        const zeroAngle = this.calculateZeroAngle(velocity, bc, zeroDistance, sightHeight, temp, altitude, pressure);
        
        // Line of sight height at target distance
        const distanceInches = distance * 36;
        const lineOfSightHeight = Math.tan(zeroAngle) * distanceInches - sightHeight;
        
        // Actual bullet drop from bore at target distance
        const bulletDrop = this.calculateBulletPath(velocity, bc, distance, temp, altitude, pressure);
        
        // Difference is what we need to correct for
        // Positive = bullet is low (need to dial up or hold high)
        // Negative = bullet is high (shouldn't happen past zero typically)
        return bulletDrop - lineOfSightHeight;
    },
    
    // Convert inches of drop to mil adjustment
    inchesToMils(inches, distance) {
        // 1 mil = 0.001 radians
        // At distance D, 1 mil subtends D * 0.001 
        // In yards: 1 mil = distance_in_yards * 36 * 0.001 inches
        // Simplified: 1 mil = distance_in_yards * 0.036 inches
        // Or at 100 yards: 1 mil = 3.6 inches
        const milValue = (distance / 100) * 3.6;
        return inches / milValue;
    },
    
    // Main dope calculation
    calculateDope(velocity, bc, distance, zeroDistance = 50, sightHeight = 1.5, temp = 59, altitude = 0, pressure = 29.92) {
        const drop = this.calculateDrop(velocity, bc, distance, zeroDistance, sightHeight, temp, altitude, pressure);
        const milAdjustment = this.inchesToMils(drop, distance);
        
        return {
            distance,
            drop: drop.toFixed(2),
            milAdjustment: milAdjustment.toFixed(2),
            milAdjustmentRaw: milAdjustment, // Keep raw value for relative calculations
            clicksQuarter: Math.round(milAdjustment * 4), // 0.25 mil clicks
            clicksTenth: Math.round(milAdjustment * 10) // 0.1 mil clicks
        };
    },
    
    // Calculate dope relative to minimum distance (first target as zero)
    calculateRelativeDope(dopeDataArray) {
        if (dopeDataArray.length === 0) return [];
        
        // Find the minimum mil adjustment (usually the closest distance)
        const minMils = Math.min(...dopeDataArray.map(d => parseFloat(d.milAdjustment)));
        
        // Calculate relative adjustments from minimum
        return dopeDataArray.map(dope => {
            const relativeMils = parseFloat(dope.milAdjustment) - minMils;
            return {
                ...dope,
                relativeMils: relativeMils.toFixed(2),
                relativeClicksTenth: Math.round(relativeMils * 10),
                relativeClicksQuarter: Math.round(relativeMils * 4)
            };
        });
    }
};