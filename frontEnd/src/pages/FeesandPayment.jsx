import { ViewFee } from "../components/fees/viewFees";
import { ViewPaymentonFee } from "../components/payments/viewPayments";

export const ViewFeeandPayments = () => {
    return (
        <div>
            <ViewFee />
            <ViewPaymentonFee />
        </div>
    );
};