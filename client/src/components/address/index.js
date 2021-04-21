import { IdentityBadge } from '@aragon/ui'
import { Fragment } from "react";
// TODO: Web Design
function Address({ address }) {
  var display = address === null ? '' : (address.substr(0, 6) + "..." + address.substr(-4, 4));
  return (
    <Fragment>
      <span title={address}>
        {display}
      </span>
    </Fragment>
  );
}
export default Address;
