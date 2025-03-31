export async function POST(req) {
    try {
        const { divisor_number, modular_number } = await req.json();

        if (!divisor_number || !modular_number) {
            return Response.json({ error: "Missing input values" }, { status: 400 });
        }

        // Compute GCD
        const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
        const gcd_value = gcd(modular_number, divisor_number);
        const total_cycle = Math.floor(modular_number / gcd_value);

        let round_number = 0;
        let accumulated_value = 0;
        let remaining_from_123 = divisor_number;
        let cycle = 1;
        let remainder_mod_45 = 0;
        let remaining_to_45 = 0;

        let results = [];

        while (cycle <= total_cycle) {
            round_number++;

            let net_gain;
            if (remainder_mod_45 > 0) {
                let gap_fill = modular_number - remainder_mod_45;
                net_gain = Math.min(gap_fill, remaining_from_123);
                accumulated_value += net_gain;
                remaining_from_123 -= net_gain;
                remainder_mod_45 = (remainder_mod_45 + net_gain) % modular_number;
                remaining_to_45 = remainder_mod_45 > 0 ? modular_number - remainder_mod_45 : 0;
            } else {
                net_gain = Math.min(modular_number, remaining_from_123);
                accumulated_value += net_gain;
                remaining_from_123 -= net_gain;
                remainder_mod_45 = net_gain % modular_number;
                remaining_to_45 = remainder_mod_45 > 0 ? modular_number - remainder_mod_45 : 0;
            }

            results.push({
                round: round_number,
                cycle,
                net_gain,
                accumulated_value,
                remaining_from_123,
                remainder_mod_45,
                remaining_to_45
            });

            if (remaining_from_123 === 0) {
                remaining_from_123 = divisor_number;
                cycle++;
            }
        }

        return Response.json({ results });

    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
