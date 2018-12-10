<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="principal">
      <Input v-model="form.principal" v-on:input="validate" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="credential">
      <Input type="password" v-model="form.credential" v-on:input="validate" placeholder="请输入密码">
        <span slot="prepend">
            <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <verify-code ref="refcode" :showWarn="vcode" @checkcode="checkCode($event)" @validate="validate">
      </verify-code>
    </FormItem>
    <FormItem>
      <Button type="primary" long :loading="loading" @click="handleSubmit">
        <span v-if="!loading">登录</span>
        <span v-else>登陆中...</span>
      </Button>
    </FormItem>
  </Form>
</template>
<script>
  import VerifyCode from '@scp/verify-code'
  import {mapActions} from 'vuex'

  export default {
    name: 'LoginForm',
    components: {
      VerifyCode
    },
    props: {
      userNameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    data() {
      return {
        loading: false,
        vcode: 0,
        form: {
          principal: 'super_admin',
          credential: ''
        }
      }
    },
    computed: {
      rules() {
        return {
          principal: this.userNameRules,
          credential: this.passwordRules
        }
      }
    },
    methods: {
      ...mapActions([
        'handleVerify'
      ]),
      checkCode(ev) {
        if (ev > 0) {
          let principal = this.form.principal;
          let credential = this.form.credential;
          this.handleVerify({principal, credential}).then(res => {
            this.vcode = res.data
            console.log(this.vcode)
          })
        } else {
          this.vcode = 0
        }
      },
      validate() {
        let validate = false
        this.$refs.loginForm.validate((valid) => {
          validate = valid
        });
        this.$refs.refcode.downSuccess = validate
        if (!validate) {
          this.$refs.refcode.reset();
        }
        return validate
      },
      handleSubmit() {
        if (this.loading) {
          return
        } else {
          this.loading = true
        }
        if (this.validate()) {
          if (this.vcode > 0) {
            this.$emit('on-success-valid', {
              principal: this.form.principal,
              credential: this.form.credential,
              vcode: this.vcode
            })
          } else {
            this.loading = false
            this.vcode = -1
          }
        } else {
          this.loading = false
        }
      }
    }
  }
</script>
