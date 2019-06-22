<!-- Adapted from https://github.com/joturako/vue2-bootstrap-modal -->
<!-- LICENSE: MIT -->
<template>
  <div
    ref="modal"
    class="modal" :class="{ show: show }"
    :aria-hidden="!show"
    tabindex="-1"
    role="dialog"
    @click.self="show = false;"
    @keyup.esc="show = false;"
  >
    <div class="modal-dialog" :class="modalSize" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            <slot name="title">{{title}}</slot>
          </h4>
          <button
            type="button"
            class="close pull-right"
            data-dismiss="modal"
            aria-label="Close"
            @click="show = false;"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div v-if="$slots['body']" class="modal-body">
          <slot name="body"></slot>
        </div>
        <div v-if="$slots['footer']" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
watch: {
    value: function(val) {
        this.show = val;
    },
    show: function() {
        if (this.show) {
                this.$refs.modal.focus();
                this.lastOverflow = document.body.style.overflow;
                document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = this.lastOverflow;
        }
        this.$emit('input', this.show);
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: this.value,
      sizeClasses: {
        large: "modal-lg",
        small: "modal-sm",
        medium: "modal-md",
        full: "modal-full"
      },
      lastOverflow: "auto"
    };
  },
  computed: {
    modalSize: function() {
      return this.sizeClasses[this.size] || "";
    }
  }
};
</script>

<style scoped>
.show {
    display: block;
    background: rgba(0, 0, 0, 0.3);
}

.modal {
  overflow-x: hidden;
  overflow-y: auto;
}

.modal-full {
  margin-left: 16px;
  margin-right: 16px;
  width: auto;
}

@media print {
  .modal {
    display: none !important;
  }
}
</style>