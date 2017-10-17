var roles = {
  'getMyRest'             :['Admin','Restaurant'],
  'getAllRests'           :['Admin','User','Restaurant'],
  'updateRest'            :['Admin'],
  'pay-order-restaurant'  :['Admin','Restaurant','User'],
  'pay-order-user'        :['Admin','Restaurant','User'],
  'all-orders-restaurants':['Admin','Receptionist'],
  'all-orders-users'      :['Admin','Receptionist'],
  'orders'                :['Admin','Restaurant','User'],
  'AddItem'               :['Admin','Restaurant','User'],
  'deleteCartItem'        :['Admin','Restaurant','User'],
  'restaurant'            :['Admin','Restaurant','User'],
  'editItem'              :['Admin','Restaurant'],
  'management'            :['Admin'],
  'permission'            :['Admin']


};



module.exports=roles;
