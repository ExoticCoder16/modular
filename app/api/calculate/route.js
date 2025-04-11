export async function POST(req) {
    try {
        const { divisor, modular } = await req.json();

        if (!divisor || !modular) {
            return Response.json({ error: "Missing input values" }, { status: 400 });
        }

        // Compute GCD
        const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
        const gcd_value = gcd(modular, divisor);
        const total_cycle = Math.floor(modular / gcd_value);

        let round = 0;
        let accumulated_value = 0;
        let remaining_from_divisor = divisor;
        let cycle = 1;
        let remainder_mod_modular = 0;
        let remaining_to_modular = 0;

        let results = [];

        while (cycle <= total_cycle) {
            round++;
        
            let net_gain = 0;
            let isMerged = false;

          
            
                if (cycle > total_cycle) break;
                if (remaining_from_divisor === 0){
                    remaining_from_divisor = divisor;
                    cycle++;
                } 
                net_gain = modular;
                accumulated_value += net_gain;
                remainder_mod_modular = remaining_from_divisor < modular ? remaining_from_divisor % modular : 0 ;
                remaining_to_modular = remainder_mod_modular > 0 ? modular - remainder_mod_modular : 0;
                if ( remainder_mod_modular > 0 ) isMerged = true;
                remaining_from_divisor -= net_gain;
            

            results.push({
                round,
                cycle,
                net_gain,
                accumulated_value,
                remaining_from_divisor,
                remainder_mod_modular,
                remaining_to_modular,
                isMerged
            });

            if (results.length === 0) {
                return Response.json({ error: "No results generated." }, { status: 400 });
            }

            console.log("results :", results);
        
            // If divisor is used up, start new cycle
            if (remaining_from_divisor === 0) {
                if (cycle > total_cycle) break;
                remaining_from_divisor = divisor;
                cycle++;
            }
        }        

        return Response.json({ gcd_value, total_cycle, results });

    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
