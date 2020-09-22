import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';
const CREATE_SCRIPTTAG = gql`
  mutation scriptTagCreate($input: ScriptTagInput!){
      scriptTagCreate(input: $input) {
        scriptTag {
          id
        }
        userErrors {
          field
          message
        }
      }
  }`;
class Index extends React.Component {
  state = { open: false };
  render() {
    const emptyState = !store.get('ids');
    let installScriptTag = !store.get('scripttag');
    const productPageScriptTagInput = {
      src: 'https://raw.githack.com/funnycat/test/master/productPageScriptTag.js', 
      displayScope: 'ONLINE_STORE',
    };
    return (
    	<Mutation mutation={CREATE_SCRIPTTAG}>
  {createScriptTag => 
      <Page>
        <TitleBar
          title="Sample App"
          primaryAction={{
          content: 'Select products',
          onAction: () => this.setState({ open: true }),
        }} />
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          onSelection={(resources) => {    
	          	const idsFromResources = resources.selection.map((product) => product.id);
			    this.setState({ open: false });
			    store.set('ids', idsFromResources);
			    if(installScriptTag){
				    const sc1 = createScriptTag({variables: { input: productPageScriptTagInput},});
				    store.set('productscripttag', sc1);
				    installScriptTag = false
				}
			}}
          onCancel={() => this.setState({ open: false })}
        />
        {emptyState ? (
          <Layout>
            <EmptyState
              heading="Discount your products temporarily"
              action={{
                content: 'Select products',
                onAction: () => this.setState({ open: true }),
              }}
              image={img}
            >
              <p>Select products to change their price temporarily.</p>
            </EmptyState>
          </Layout>
        ) : (
            <ResourceListWithProducts />
          )}
      </Page>
        }
		</Mutation>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
    createScriptTag;
  };
}
export default Index;